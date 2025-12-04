// Preset AI-generated avatars using DiceBear API
// DiceBear is a free avatar library with various styles

const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji',
  'icons',
  'identicon',
  'lorelei',
  'micah',
  'miniavs',
  'pixel-art',
  'shapes'
];

// Generate preset avatars
const PRESET_AVATARS = [
  // Adventurer style
  { id: 'adv-1', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4' },
  { id: 'adv-2', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=c0aede' },
  { id: 'adv-3', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=d1d4f9' },
  { id: 'adv-4', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Max&backgroundColor=ffd5dc' },
  
  // Adventurer Neutral style
  { id: 'advn-1', url: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Jasper&backgroundColor=ffdfbf' },
  { id: 'advn-2', url: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Chloe&backgroundColor=b6e3f4' },
  { id: 'advn-3', url: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Oliver&backgroundColor=c0aede' },
  { id: 'advn-4', url: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Emma&backgroundColor=d1d4f9' },
  
  // Avataaars style (popular cartoon style)
  { id: 'ava-1', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack&backgroundColor=ffd5dc' },
  { id: 'ava-2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf' },
  { id: 'ava-3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=b6e3f4' },
  { id: 'ava-4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=c0aede' },
  
  // Big Smile style
  { id: 'smile-1', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Happy&backgroundColor=d1d4f9' },
  { id: 'smile-2', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Joy&backgroundColor=ffd5dc' },
  { id: 'smile-3', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Sunny&backgroundColor=ffdfbf' },
  { id: 'smile-4', url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Bright&backgroundColor=b6e3f4' },
  
  // Lorelei style (modern illustrations)
  { id: 'lor-1', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Grace&backgroundColor=c0aede' },
  { id: 'lor-2', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Lily&backgroundColor=d1d4f9' },
  { id: 'lor-3', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Rose&backgroundColor=ffd5dc' },
  { id: 'lor-4', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Iris&backgroundColor=ffdfbf' },
  
  // Pixel Art style
  { id: 'pixel-1', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro&backgroundColor=b6e3f4' },
  { id: 'pixel-2', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gamer&backgroundColor=c0aede' },
  { id: 'pixel-3', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Arcade&backgroundColor=d1d4f9' },
  { id: 'pixel-4', url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Classic&backgroundColor=ffd5dc' },

  // Fun Emoji style
  { id: 'emoji-1', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun1&backgroundColor=ffdfbf' },
  { id: 'emoji-2', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun2&backgroundColor=b6e3f4' },
  { id: 'emoji-3', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun3&backgroundColor=c0aede' },
  { id: 'emoji-4', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fun4&backgroundColor=d1d4f9' },
];

// Generate random avatar URL for a given seed
const generateAvatarUrl = (seed, style = 'adventurer') => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

// Get default avatar for a user
const getDefaultAvatar = (userName) => {
  return generateAvatarUrl(userName, 'adventurer');
};

export {
  PRESET_AVATARS,
  AVATAR_STYLES,
  generateAvatarUrl,
  getDefaultAvatar,
};

