import os
from PIL import Image, ImageDraw, ImageFont

def ensure_dir(path):
    os.makedirs(path, exist_ok=True)

def get_font(size, bold=False):
    # Try common system fonts on Windows
    candidates = [
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()

def draw_badge(draw, center_x, center_y, width, height, radius, bg_color, title_text, sub_text, sub_color, title_color="#FFFFFF"):
    left = center_x - width // 2
    top = center_y - height // 2
    right = left + width
    bottom = top + height
    
    # Draw rounded rectangle badge
    draw.rounded_rectangle([left, top, right, bottom], radius=radius, fill=bg_color)
    
    # Draw title
    title_font = get_font(int(height * 0.32), bold=True)
    # Measure title
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    
    # Subtitle
    sub_font = get_font(int(height * 0.22), bold=False)
    s_bbox = draw.textbbox((0, 0), sub_text, font=sub_font)
    sw = s_bbox[2] - s_bbox[0]
    sh = s_bbox[3] - s_bbox[1]
    
    total_text_h = th + 8 + sh
    title_y = center_y - total_text_h // 2
    sub_y = title_y + th + 10
    
    draw.text((center_x - tw // 2, title_y), title_text, fill=title_color, font=title_font)
    draw.text((center_x - sw // 2, sub_y), sub_text, fill=sub_color, font=sub_font)

def create_customer_assets(out_dir):
    ensure_dir(out_dir)
    
    # 1. icon.png (1024x1024) - full icon on brand onyx
    img_icon = Image.new("RGBA", (1024, 1024), "#FAF8F4")
    draw = ImageDraw.Draw(img_icon)
    # Centered Onyx badge
    draw_badge(draw, 512, 512, 600, 320, 78, "#0B0C0E", "XTREME", "CONCIERGE", "#C6A15B", "#FFFFFF")
    img_icon.save(os.path.join(out_dir, "icon.png"), "PNG")
    
    # 2. adaptive-icon.png (1024x1024) - foreground inside 66% safe circle
    img_adaptive = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    draw_ad = ImageDraw.Draw(img_adaptive)
    draw_badge(draw_ad, 512, 512, 520, 280, 68, "#0B0C0E", "XTREME", "CONCIERGE", "#C6A15B", "#FFFFFF")
    img_adaptive.save(os.path.join(out_dir, "adaptive-icon.png"), "PNG")
    
    # 3. splash.png (1242x2688) - Ivory Sand canvas with centered badge
    img_splash = Image.new("RGBA", (1242, 2688), "#FAF8F4")
    draw_sp = ImageDraw.Draw(img_splash)
    draw_badge(draw_sp, 621, 1344, 460, 248, 60, "#0B0C0E", "XTREME", "CONCIERGE", "#C6A15B", "#FFFFFF")
    img_splash.save(os.path.join(out_dir, "splash.png"), "PNG")
    
    # 4. favicon.png (48x48)
    img_fav = Image.new("RGBA", (48, 48), "#0B0C0E")
    draw_fav = ImageDraw.Draw(img_fav)
    f_font = get_font(22, bold=True)
    draw_fav.text((12, 10), "X", fill="#C6A15B", font=f_font)
    img_fav.save(os.path.join(out_dir, "favicon.png"), "PNG")
    print(f"Customer assets generated in {out_dir}")

def create_staff_assets(out_dir):
    ensure_dir(out_dir)
    
    # 1. icon.png (1024x1024) - Ivory background with Atlantic Teal badge
    img_icon = Image.new("RGBA", (1024, 1024), "#FAF8F4")
    draw = ImageDraw.Draw(img_icon)
    draw_badge(draw, 512, 512, 600, 320, 78, "#164D53", "XTREME", "STAFF OPS", "#F1E7D2", "#FFFFFF")
    img_icon.save(os.path.join(out_dir, "icon.png"), "PNG")
    
    # 2. adaptive-icon.png (1024x1024) - foreground inside safe area
    img_adaptive = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    draw_ad = ImageDraw.Draw(img_adaptive)
    draw_badge(draw_ad, 512, 512, 520, 280, 68, "#164D53", "XTREME", "STAFF OPS", "#F1E7D2", "#FFFFFF")
    img_adaptive.save(os.path.join(out_dir, "adaptive-icon.png"), "PNG")
    
    # 3. splash.png (1242x2688)
    img_splash = Image.new("RGBA", (1242, 2688), "#FAF8F4")
    draw_sp = ImageDraw.Draw(img_splash)
    draw_badge(draw_sp, 621, 1344, 460, 248, 60, "#164D53", "XTREME", "STAFF OPS", "#F1E7D2", "#FFFFFF")
    img_splash.save(os.path.join(out_dir, "splash.png"), "PNG")
    
    # 4. favicon.png (48x48)
    img_fav = Image.new("RGBA", (48, 48), "#164D53")
    draw_fav = ImageDraw.Draw(img_fav)
    f_font = get_font(22, bold=True)
    draw_fav.text((12, 10), "X", fill="#FFFFFF", font=f_font)
    img_fav.save(os.path.join(out_dir, "favicon.png"), "PNG")
    print(f"Staff assets generated in {out_dir}")

if __name__ == "__main__":
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    create_customer_assets(os.path.join(base, "apps", "customer-mobile", "assets"))
    create_staff_assets(os.path.join(base, "apps", "staff-mobile", "assets"))
