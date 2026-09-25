// Chains a tight face-zoom crop onto a Cloudinary delivery URL; other URLs are returned unchanged.
export function faceThumbnail(url: string, size: number): string {
  if (!url.includes("res.cloudinary.com") || !/\/v\d+\//.test(url)) return url;
  return url.replace(/\/(v\d+\/)/, `/c_thumb,g_face,z_0.7,h_${size},w_${size}/$1`);
}
