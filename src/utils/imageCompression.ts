export const compressImage = async (base64String: string): Promise<string> => {
    // Target: keep under 100KB per image to stay well under 1MB Firestore limit
    const targetSize = 100000; // 100KB per image
    
    // If already small enough, return as is
    if (base64String.length < targetSize) {
        return base64String;
    }

    // Create an image element
    const img = new Image();
    img.src = base64String;

    // Wait for image to load
    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate new dimensions - balance quality and size
    let width = img.width;
    let height = img.height;
    let maxSize = 600; // Start with 600px

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

    // Draw image on canvas
    ctx.drawImage(img, 0, 0, width, height);

    // Try WebP first (better compression)
    let result: string;
    try {
        result = canvas.toDataURL('image/webp', 0.75);
    } catch (e) {
        // Fallback to JPEG if WebP not supported
        result = canvas.toDataURL('image/jpeg', 0.75);
    }

    // If still too large, reduce dimensions
    if (result.length > targetSize) {
        maxSize = 400;
        if (img.width > img.height && img.width > maxSize) {
            height = Math.round((img.height * maxSize) / img.width);
            width = maxSize;
        } else if (img.height > maxSize) {
            width = Math.round((img.width * maxSize) / img.height);
            height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
            result = canvas.toDataURL('image/webp', 0.7);
        } catch (e) {
            result = canvas.toDataURL('image/jpeg', 0.7);
        }
    }

    // If still too large, reduce quality aggressively
    if (result.length > targetSize) {
        try {
            result = canvas.toDataURL('image/webp', 0.5);
        } catch (e) {
            result = canvas.toDataURL('image/jpeg', 0.5);
        }
    }

    // Last resort: reduce dimensions to 300px
    if (result.length > targetSize) {
        maxSize = 300;
        if (img.width > img.height && img.width > maxSize) {
            height = Math.round((img.height * maxSize) / img.width);
            width = maxSize;
        } else if (img.height > maxSize) {
            width = Math.round((img.width * maxSize) / img.height);
            height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        try {
            result = canvas.toDataURL('image/webp', 0.4);
        } catch (e) {
            result = canvas.toDataURL('image/jpeg', 0.4);
        }
    }

    return result;
}; 