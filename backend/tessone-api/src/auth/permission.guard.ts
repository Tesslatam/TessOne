import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      request.permissionName = 'NONE';
      request.permissionRequired = 'FAIL';
      throw new ForbiddenException('Usuario no autenticado');
    }

    const permissionRequired = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!permissionRequired) {
      request.permissionName = 'NONE';
      request.permissionRequired = 'OK';
      return true;
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        employee: {
          include: {
            employeePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!dbUser) {
      request.permissionName = permissionRequired;
      request.permissionRequired = 'FAIL';
      throw new ForbiddenException('Usuario no válido');
    }

    const rolePermissions =
      dbUser.role?.rolePermissions.map((rp) => rp.permission.code) || [];

    const employeePermissions =
      dbUser.employee?.employeePermissions.map((ep) => ep.permission.code) || [];

    const allPermissions = [...rolePermissions, ...employeePermissions];

    request.permissionName = permissionRequired;

    if (!allPermissions.includes(permissionRequired)) {
      request.permissionRequired = 'FAIL';
      throw new ForbiddenException('No tienes permiso');
    }

    request.permissionRequired = 'OK';
    return true;
  }
}
