'use client';

interface UserAvatarProps {
  name?: string;
  photoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({
  name = 'U',
  photoUrl,
  size = 'md',
}: UserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase();

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-2xl',
  };

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-white/10`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-purple-600 text-white flex items-center justify-center font-bold`}
    >
      {initial}
    </div>
  );
}
