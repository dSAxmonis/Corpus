import {
  FiPlay, FiGithub, FiTwitter, FiLinkedin, FiFileText, FiImage,
  FiGlobe, FiMessageCircle, FiBookOpen,
} from 'react-icons/fi'

export function getContentTypeIcon(contentType, itemType) {
  if (contentType === 'youtube') return FiPlay
  if (contentType === 'github') return FiGithub
  if (contentType === 'tweet') return FiTwitter
  if (contentType === 'linkedin') return FiLinkedin
  if (contentType === 'reddit') return FiMessageCircle
  if (contentType === 'article') return FiBookOpen
  if (contentType === 'pdf') return FiFileText
  if (itemType === 'image') return FiImage
  if (itemType === 'note' || itemType === 'quote') return FiFileText
  return FiGlobe
}
