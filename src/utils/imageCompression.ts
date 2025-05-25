export const compressImage = async (base64String: string): Promise<string> => {
    // If the image is already small enough, return it as is
    if (base64String.length < 150000) { // Increased threshold to 150KB for better quality
        return base64String;
    }

    // Create an image element
    const img = new Image();
    img.src = base64String;

    // Wait for image to load
    await new Promise(resolve => {
        img.onload = resolve;
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate new dimensions (max 500px width/height while maintaining aspect ratio)
    let width = img.width;
    let height = img.height;
    const maxSize = 500; // Increased from 100px to 500px for higher quality

    if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width);
        width = maxSize;
    } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height);
        height = maxSize;
    }

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw image on canvas with new dimensions
    ctx.drawImage(img, 0, 0, width, height);

    // Try different quality levels until we get a small enough size
    let quality = 0.7;
    let result = canvas.toDataURL('image/jpeg', quality);
    
    while (result.length > 20000 && quality > 0.1) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
    }

    // If still too large, return error
    if (result.length > 20000) {
        throw new Error('Unable to compress image to required size');
    }

    return result;
}; 