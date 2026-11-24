import os, shutil
from PIL import Image, ImageDraw, ImageFont

# Set working directory to repo root
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(repo_root)

scratch_dir = r"C:\Users\rakib_bro\.gemini\antigravity\brain\21653daa-a859-4e78-9fd0-d16d6235bd4c\scratch"
master_logo_path = os.path.join(scratch_dir, "master_logo_560x237.png")
logo_master = Image.open(master_logo_path).convert("RGBA")

# 1. Update logo.png in packages/ui and apps
targets = [
    os.path.join(repo_root, "packages", "ui", "src", "assets", "logo.png"),
    os.path.join(repo_root, "apps", "customer-mobile", "assets", "logo.png"),
    os.path.join(repo_root, "apps", "staff-mobile", "assets", "logo.png"),
]
for t in targets:
    os.makedirs(os.path.dirname(t), exist_ok=True)
    shutil.copy2(master_logo_path, t)
    print("Copied master logo to:", t)

# Colors from Design System v1.0
IVORY = (250, 248, 244, 255)  # #FAF8F4
ATLANTIC = (22, 77, 83, 255)   # #164D53
GOLD = (198, 161, 91, 255)     # #C6A15B
WHITE = (255, 255, 255, 255)

# Font helper
def get_font(size):
    font_names = ["Arial.ttf", "arial.ttf", "DejaVuSans.ttf", "segoeui.ttf"]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except:
            pass
    return ImageFont.load_default()

# 2. Customer App Icon (1024x1024, Ivory bg)
cust_icon = Image.new("RGBA", (1024, 1024), IVORY)
w = 640
h = int(237 * (w / 560))
scaled_logo = logo_master.resize((w, h), Image.Resampling.LANCZOS)
x = (1024 - w) // 2
y = (1024 - h) // 2
cust_icon.paste(scaled_logo, (x, y), scaled_logo)
cust_icon.save(os.path.join(repo_root, "apps", "customer-mobile", "assets", "icon.png"), "PNG")
print("Saved Customer icon.png")

# 3. Customer Adaptive Icon (1024x1024, transparent bg, safe zone ~512px width)
cust_adaptive = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
w_adapt = 512
h_adapt = int(237 * (w_adapt / 560))
scaled_adapt = logo_master.resize((w_adapt, h_adapt), Image.Resampling.LANCZOS)
x_adapt = (1024 - w_adapt) // 2
y_adapt = (1024 - h_adapt) // 2
cust_adaptive.paste(scaled_adapt, (x_adapt, y_adapt), scaled_adapt)
cust_adaptive.save(os.path.join(repo_root, "apps", "customer-mobile", "assets", "adaptive-icon.png"), "PNG")
print("Saved Customer adaptive-icon.png")

# 4. Customer Splash (1242x2688, Ivory bg)
cust_splash = Image.new("RGBA", (1242, 2688), IVORY)
w_splash = 560
h_splash = 237
scaled_splash = logo_master.resize((w_splash, h_splash), Image.Resampling.LANCZOS)
x_splash = (1242 - w_splash) // 2
y_splash = (2688 - h_splash) // 2
cust_splash.paste(scaled_splash, (x_splash, y_splash), scaled_splash)
cust_splash.save(os.path.join(repo_root, "apps", "customer-mobile", "assets", "splash.png"), "PNG")
print("Saved Customer splash.png")

# 5. Customer Favicon (48x48)
cust_fav = Image.new("RGBA", (48, 48), IVORY)
fav_w = 42
fav_h = int(237 * (fav_w / 560))
scaled_fav = logo_master.resize((fav_w, fav_h), Image.Resampling.LANCZOS)
cust_fav.paste(scaled_fav, ((48 - fav_w) // 2, (48 - fav_h) // 2), scaled_fav)
cust_fav.save(os.path.join(repo_root, "apps", "customer-mobile", "assets", "favicon.png"), "PNG")
print("Saved Customer favicon.png")

# Helper to draw Staff pill under logo
def compose_staff_logo(target_logo_width):
    logo_w = target_logo_width
    logo_h = int(237 * (logo_w / 560))
    s_logo = logo_master.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    
    # Pill dimensions
    pill_w = int(logo_w * 0.72)
    pill_h = int(logo_h * 0.22)
    total_h = logo_h + int(pill_h * 0.4) + pill_h
    
    comp = Image.new("RGBA", (logo_w, total_h), (0, 0, 0, 0))
    comp.paste(s_logo, (0, 0), s_logo)
    
    # Draw pill
    draw = ImageDraw.Draw(comp)
    pill_x0 = (logo_w - pill_w) // 2
    pill_y0 = logo_h + int(pill_h * 0.4)
    pill_x1 = pill_x0 + pill_w
    pill_y1 = pill_y0 + pill_h
    radius = pill_h // 2
    draw.rounded_rectangle([pill_x0, pill_y0, pill_x1, pill_y1], radius=radius, fill=ATLANTIC)
    
    # Text
    f_size = max(10, int(pill_h * 0.52))
    font = get_font(f_size)
    text = "STAFF OPERATIONS"
    tb = draw.textbbox((0, 0), text, font=font)
    tw = tb[2] - tb[0]
    th = tb[3] - tb[1]
    tx = pill_x0 + (pill_w - tw) // 2
    ty = pill_y0 + (pill_h - th) // 2 - int(tb[1] * 0.5)
    draw.text((tx, ty), text, fill=IVORY, font=font)
    
    return comp

# 6. Staff App Icon (1024x1024, Ivory bg)
staff_comp = compose_staff_logo(620)
staff_icon = Image.new("RGBA", (1024, 1024), IVORY)
x = (1024 - staff_comp.width) // 2
y = (1024 - staff_comp.height) // 2
staff_icon.paste(staff_comp, (x, y), staff_comp)
staff_icon.save(os.path.join(repo_root, "apps", "staff-mobile", "assets", "icon.png"), "PNG")
print("Saved Staff icon.png")

# 7. Staff Adaptive Icon (1024x1024, transparent bg)
staff_adapt_comp = compose_staff_logo(500)
staff_adaptive = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
x = (1024 - staff_adapt_comp.width) // 2
y = (1024 - staff_adapt_comp.height) // 2
staff_adaptive.paste(staff_adapt_comp, (x, y), staff_adapt_comp)
staff_adaptive.save(os.path.join(repo_root, "apps", "staff-mobile", "assets", "adaptive-icon.png"), "PNG")
print("Saved Staff adaptive-icon.png")

# 8. Staff Splash (1242x2688, Ivory bg)
staff_splash_comp = compose_staff_logo(540)
staff_splash = Image.new("RGBA", (1242, 2688), IVORY)
x = (1242 - staff_splash_comp.width) // 2
y = (2688 - staff_splash_comp.height) // 2
staff_splash.paste(staff_splash_comp, (x, y), staff_splash_comp)
staff_splash.save(os.path.join(repo_root, "apps", "staff-mobile", "assets", "splash.png"), "PNG")
print("Saved Staff splash.png")

# 9. Staff Favicon (48x48)
staff_fav_comp = compose_staff_logo(44)
staff_fav = Image.new("RGBA", (48, 48), IVORY)
x = (48 - staff_fav_comp.width) // 2
y = (48 - staff_fav_comp.height) // 2
staff_fav.paste(staff_fav_comp, (x, y), staff_fav_comp)
staff_fav.save(os.path.join(repo_root, "apps", "staff-mobile", "assets", "favicon.png"), "PNG")
print("Saved Staff favicon.png")

print("All native assets generated successfully!")
