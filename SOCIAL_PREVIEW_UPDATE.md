# Social Preview Image Update Guide

## How to Update the Social Preview Image

The social preview image for CoderX is located at:
```
public/social_preview_index.jpg
```

### To Update the Image:

1. **Replace the Image File**:
   - Replace `public/social_preview_index.jpg` with your new image
   - Keep the same filename: `social_preview_index.jpg`
   - Recommended size: 1200x630 pixels (GitHub's recommended social preview size)

2. **Commit and Push**:
   ```bash
   git add public/social_preview_index.jpg
   git commit -m "Update social preview image"
   git push origin main
   ```

3. **GitHub Display**:
   - The image will automatically appear in the README
   - GitHub may take 5-10 minutes to update cached images
   - If needed, add `?v=1` to the image URL in README.md to force refresh

### Current Image Reference in README:
```markdown
[![CoderX: AI-Powered Development Platform](./public/social_preview_index.jpg)](https://github.com/Suryanshu-Nabheet/CoderX)
```

### Notes:
- Only this one image is used for social preview
- All old logo images have been removed
- Header uses text-based CoderX logo (no images)
- Easy to maintain and update
