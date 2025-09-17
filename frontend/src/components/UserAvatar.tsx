import React from 'react';

interface UserAvatarProps {
  username: string;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ username, size = 'md' }) => {
  // Genera iniziali dal nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Genera colore basato sul nome
  const getColorFromName = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-cyan-500',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  // Dimensioni basate sulla prop size
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  const bgColor = getColorFromName(username);
  const initials = getInitials(username);
  const sizeClass = sizeClasses[size];

  return (
    <div className={`
      ${sizeClass}
      ${bgColor}
      rounded-full
      flex
      items-center
      justify-center
      text-white
      font-semibold
      shadow-md
    `}>
      {initials}
    </div>
  );
};

export default UserAvatar;