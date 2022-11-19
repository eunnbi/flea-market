export const getImageUrl = ({ version, publicId, format }: { version: string; publicId: string; format: string }) => {
  return `https://res.cloudinary.com/${String(process.env.NEXT_PUBLIC_CLOUD_NAME)}/v${version}/${publicId}.${format}`;
};
