import os
from PIL import Image, ImageDraw, ImageFont
import textwrap

# Pinterest Pin Generator for StreamBackdrops Images
# Processes images from multiple folders and creates Pinterest-ready pins

# Configuration
BASE_FOLDER = "public/images"  # Change this to your actual path
OUTPUT_FOLDER = "pinterest_pins"
PINTEREST_SIZE = (1000, 1500)  # Standard Pinterest pin dimensions

# Text templates for each category - Pinterest marketing focused
TEXT_TEMPLATES = {
    "well-lit": [
        "FREE Professional Video Background ✨",
        "Download FREE Zoom Background",
        "FREE Bright Office Background",
        "Professional Background - FREE Download",
        "Get This FREE Video Background"
    ],
    "ambient-lighting": [
        "FREE Cozy Video Background 🌟",
        "Download FREE Ambient Background", 
        "FREE Mood Lighting Background",
        "Cozy Background - FREE Download",
        "Get This FREE Ambient Background"
    ],
    "office-spaces": [
        "FREE Professional Office Background 💼",
        "Download FREE Corporate Background",
        "FREE Executive Office Background", 
        "Business Background - FREE Download",
        "Get This FREE Office Background"
    ],
    "living-room": [
        "FREE Cozy Home Background 🏠",
        "Download FREE Living Room Background",
        "FREE Comfortable Home Background",
        "Home Background - FREE Download", 
        "Get This FREE Home Background"
    ]
}

# Brand colors (you can customize these)
BRAND_COLORS = {
    "primary": "#2C3E50",      # Dark blue-gray
    "accent": "#E74C3C",       # Red accent
    "text": "#FFFFFF",          # White text
    "overlay": (44, 62, 80, 180)  # Semi-transparent overlay
}

def create_pinterest_pin(image_path, text, output_path):
    """Create a Pinterest pin from an image with text overlay - Smart Aspect Ratio"""
    try:
        # Open image
        image = Image.open(image_path)
        image = image.convert("RGBA")
        
        # Calculate aspect ratios
        image_ratio = image.width / image.height
        pin_ratio = PINTEREST_SIZE[0] / PINTEREST_SIZE[1]  # 1000/1500 = 0.67
        
        # Create Pinterest-sized canvas with gradient background
        pin_image = Image.new("RGBA", PINTEREST_SIZE, (240, 240, 240, 255))
        
        # Create subtle gradient background
        gradient = Image.new("RGBA", PINTEREST_SIZE, (220, 220, 220, 255))
        for y in range(PINTEREST_SIZE[1]):
            # Subtle vertical gradient from light gray to slightly darker
            color_value = int(240 - (y / PINTEREST_SIZE[1]) * 40)  # 240 to 200
            for x in range(PINTEREST_SIZE[0]):
                gradient.putpixel((x, y), (color_value, color_value, color_value, 255))
        
        pin_image = gradient
        
        if image_ratio > pin_ratio:
            # Image is wider than pin ratio - fit to width, add top/bottom letterbox
            new_width = PINTEREST_SIZE[0]
            new_height = int(new_width / image_ratio)
            
            # Don't let image be too small
            if new_height < PINTEREST_SIZE[1] * 0.4:  # At least 40% of pin height
                new_height = int(PINTEREST_SIZE[1] * 0.6)  # Use 60% of pin height
                new_width = int(new_height * image_ratio)
        else:
            # Image is taller than pin ratio - fit to height, add side pillarbox
            new_height = int(PINTEREST_SIZE[1] * 0.75)  # Use 75% of pin height for image
            new_width = int(new_height * image_ratio)
            
            # Don't let image be too narrow
            if new_width < PINTEREST_SIZE[0] * 0.5:  # At least 50% of pin width
                new_width = int(PINTEREST_SIZE[0] * 0.8)  # Use 80% of pin width
                new_height = int(new_width / image_ratio)
        
        # Resize image
        image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Center the image on the canvas
        x_offset = (PINTEREST_SIZE[0] - new_width) // 2
        y_offset = (PINTEREST_SIZE[1] - new_height) // 2
        
        # Position image in upper portion to leave room for text
        y_offset = min(y_offset, 100)  # Don't go below 100px from top
        
        # Paste image onto gradient background
        pin_image.paste(image, (x_offset, y_offset), image if image.mode == 'RGBA' else None)
        
        # Create text overlay
        draw = ImageDraw.Draw(pin_image)
        
        # Try to load fonts - much larger for impact
        try:
            font_huge = ImageFont.truetype("arial.ttf", 72)      # Main text
            font_large = ImageFont.truetype("arial.ttf", 42)     # Subtitle
            font_medium = ImageFont.truetype("arial.ttf", 32)    # URL
        except:
            try:
                font_huge = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 72)
                font_large = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 42)
                font_medium = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 32)
            except:
                font_huge = ImageFont.load_default()
                font_large = ImageFont.load_default()
                font_medium = ImageFont.load_default()
        
        # Split text into main text and "FREE" if present
        if "FREE" in text.upper():
            main_text = text.replace("FREE ", "").replace("Free ", "")
            free_text = "FREE"
        else:
            main_text = text
            free_text = "FREE"
        
        # Find text area - use bottom portion and any available space
        text_start_y = y_offset + new_height + 20  # Start below image
        text_area_height = PINTEREST_SIZE[1] - text_start_y - 120  # Leave room for URL
        
        # If not enough space below image, overlay on image with dark background
        if text_area_height < 200:
            text_start_y = PINTEREST_SIZE[1] - 350
            # Add semi-transparent overlay for text readability
            overlay_height = 350
            overlay = Image.new("RGBA", (PINTEREST_SIZE[0], overlay_height), (0, 0, 0, 0))
            overlay_draw = ImageDraw.Draw(overlay)
            
            # Create gradient overlay from transparent to semi-opaque
            for i in range(overlay_height):
                alpha = int(180 * (i / overlay_height))  # Fade from 0 to 180
                overlay_draw.rectangle([0, i, PINTEREST_SIZE[0], i+1], fill=(0, 0, 0, alpha))
            
            pin_image.paste(overlay, (0, PINTEREST_SIZE[1] - overlay_height), overlay)
        
        # Add "FREE" text
        free_bbox = draw.textbbox((0, 0), free_text, font=font_huge)
        free_width = free_bbox[2] - free_bbox[0]
        free_x = (PINTEREST_SIZE[0] - free_width) // 2
        free_y = text_start_y + 20
        
        # FREE text with strong shadow and bright color
        shadow_offset = 4
        draw.text((free_x + shadow_offset, free_y + shadow_offset), free_text, 
                 font=font_huge, fill=(0, 0, 0, 200))  # Strong shadow
        draw.text((free_x, free_y), free_text, 
                 font=font_huge, fill=(255, 255, 0))    # Bright yellow
        
        # Main text below FREE
        wrapped_main = textwrap.fill(main_text, width=15)  # Shorter lines for impact
        main_bbox = draw.textbbox((0, 0), wrapped_main, font=font_large)
        main_width = main_bbox[2] - main_bbox[0]
        main_x = (PINTEREST_SIZE[0] - main_width) // 2
        main_y = free_y + 90
        
        # Main text with shadow
        draw.text((main_x + shadow_offset, main_y + shadow_offset), wrapped_main, 
                 font=font_large, fill=(0, 0, 0, 180))
        draw.text((main_x, main_y), wrapped_main, 
                 font=font_large, fill=(255, 255, 255))
        
        # Website URL with prominent styling at bottom
        url_text = "StreamBackdrops.com"
        download_text = "FREE DOWNLOADS ↓"
        
        # Download call-to-action
        download_bbox = draw.textbbox((0, 0), download_text, font=font_medium)
        download_width = download_bbox[2] - download_bbox[0]
        download_x = (PINTEREST_SIZE[0] - download_width) // 2
        download_y = PINTEREST_SIZE[1] - 120
        
        # URL below that
        url_bbox = draw.textbbox((0, 0), url_text, font=font_medium)
        url_width = url_bbox[2] - url_bbox[0]
        url_x = (PINTEREST_SIZE[0] - url_width) // 2
        url_y = PINTEREST_SIZE[1] - 70
        
        # Bright red background for bottom section
        bottom_bg = Image.new("RGBA", (PINTEREST_SIZE[0], 100), (231, 76, 60, 220))
        pin_image.paste(bottom_bg, (0, PINTEREST_SIZE[1] - 100), bottom_bg)
        
        # Add download text
        draw.text((download_x + 2, download_y + 2), download_text, 
                 font=font_medium, fill=(0, 0, 0, 150))
        draw.text((download_x, download_y), download_text, 
                 font=font_medium, fill=(255, 255, 255))
        
        # Add URL
        draw.text((url_x + 2, url_y + 2), url_text, 
                 font=font_medium, fill=(0, 0, 0, 150))
        draw.text((url_x, url_y), url_text, 
                 font=font_medium, fill=(255, 255, 255))
        
        # Convert back to RGB and save
        final_image = Image.new("RGB", PINTEREST_SIZE, (255, 255, 255))
        final_image.paste(pin_image, (0, 0), pin_image)
        final_image.save(output_path, "PNG", quality=95)
        
        print(f"✅ Created: {output_path}")
        return True
        
    except Exception as e:
        print(f"❌ Error processing {image_path}: {str(e)}")
        return False

def process_folder(folder_name):
    """Process all images in a specific folder"""
    folder_path = os.path.join(BASE_FOLDER, folder_name)
    
    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return
    
    # Create output subfolder
    output_subfolder = os.path.join(OUTPUT_FOLDER, folder_name)
    os.makedirs(output_subfolder, exist_ok=True)
    
    # Get text templates for this category
    templates = TEXT_TEMPLATES.get(folder_name, ["Professional Video Background"])
    
    # Get all image files
    image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp')
    image_files = [f for f in os.listdir(folder_path) 
                   if f.lower().endswith(image_extensions)]
    
    if not image_files:
        print(f"❌ No images found in {folder_path}")
        return
    
    print(f"\n📁 Processing {len(image_files)} images in {folder_name}/")
    
    successful = 0
    for i, image_file in enumerate(image_files):
        image_path = os.path.join(folder_path, image_file)
        
        # Use different text template for each image (cycle through templates)
        text = templates[i % len(templates)]
        
        # Create output filename
        base_name = os.path.splitext(image_file)[0]
        output_file = f"{base_name}_pinterest.png"
        output_path = os.path.join(output_subfolder, output_file)
        
        if create_pinterest_pin(image_path, text, output_path):
            successful += 1
    
    print(f"✅ Successfully created {successful} Pinterest pins for {folder_name}")

def main():
    """Main function to process all folders"""
    print("🎨 Pinterest Pin Generator for StreamBackdrops")
    print("=" * 50)
    
    # Create output directory
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    
    # List of folders to process
    folders = ["well-lit", "ambient-lighting", "office-spaces", "living-room"]
    
    total_processed = 0
    for folder in folders:
        process_folder(folder)
        total_processed += 1
    
    print("\n" + "=" * 50)
    print(f"🎉 Completed! Processed {len(folders)} folders.")
    print(f"📁 Pinterest pins saved to: {OUTPUT_FOLDER}/")
    print("\nReady to upload to Pinterest! 📌")

if __name__ == "__main__":
    main()