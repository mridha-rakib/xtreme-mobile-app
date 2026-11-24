import os
import shutil
from PIL import Image, ImageDraw, ImageFont

def generate_branding():
    # Set working directory to repo root based on script location
    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.abspath(os.path.join(script_dir, ".."))
    os.chdir(repo_root)

    # Master artwork committed in packages/ui/src/assets/logo.png
    master_logo_path = os.path.join(repo_root, "packages", "ui", "src", "assets", "logo.png")
    if not os.path.exists(master_logo_path):
        raise FileNotFoundError(f"Master logo artwork not found at {master_logo_path}")

    logo_master = Image.open(master_logo_path).convert("RGBA")
    print(f"Loaded master branding artwork: {master_logo_path} ({logo_master.size[0]}x{logo_master.size[1]})")

    # Authoritative Design System v1.0 Colors
    IVORY = (250, 248, 244, 255)  # #FAF8F4
    ATLANTIC = (22, 77, 83, 255)   # #164D53 (Staff Accent)
    GOLD = (198, 161, 91, 255)     # #C6A15B
    TRANSPARENT = (0, 0, 0, 0)

    # Font resolver
    def get_font(size):
        font_names = ["Arial.ttf", "arial.ttf", "DejaVuSans.ttf", "segoeui.ttf"]
        for fn in font_names:
            try:
                return ImageFont.truetype(fn, size)
            except Exception:
                pass
        return ImageFont.load_default()

    # 1. Sync logo.png across apps
    app_logo_targets = [
        os.path.join(repo_root, "apps", "customer-mobile", "assets", "logo.png"),
        os.path.join(repo_root, "apps", "staff-mobile", "assets", "logo.png"),
    ]
    for target in app_logo_targets:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        shutil.copy2(master_logo_path, target)
        print(f"✓ Synchronized master logo: {target}")

    # ==========================================
    # CUSTOMER MOBILE ASSETS
    # ==========================================
    cust_assets_dir = os.path.join(repo_root, "apps", "customer-mobile", "assets")

    # A. Customer App Icon (1024x1024, Ivory bg, centered logo)
    cust_icon = Image.new("RGBA", (1024, 1024), IVORY)
    w_icon = 640
    h_icon = int(237 * (w_icon / 560))
    scaled_logo = logo_master.resize((w_icon, h_icon), Image.Resampling.LANCZOS)
    cust_icon.paste(scaled_logo, ((1024 - w_icon) // 2, (1024 - h_icon) // 2), scaled_logo)
    cust_icon.save(os.path.join(cust_assets_dir, "icon.png"), "PNG")
    print("✓ Generated Customer icon.png (1024x1024)")

    # B. Customer Adaptive Icon Foreground (1024x1024, transparent bg, inside 66% safe circle = 660px)
    cust_adaptive = Image.new("RGBA", (1024, 1024), TRANSPARENT)
    w_adapt = 512
    h_adapt = int(237 * (w_adapt / 560))
    scaled_adapt = logo_master.resize((w_adapt, h_adapt), Image.Resampling.LANCZOS)
    cust_adaptive.paste(scaled_adapt, ((1024 - w_adapt) // 2, (1024 - h_adapt) // 2), scaled_adapt)
    cust_adaptive.save(os.path.join(cust_assets_dir, "adaptive-icon.png"), "PNG")
    print("✓ Generated Customer adaptive-icon.png (1024x1024, transparent)")

    # C. Customer Splash Screen Icon (expo-splash-screen standalone image, transparent bg, native logo aspect ratio)
    # Recommended width ~280-320px for high-density Android 12+ splash icon
    w_splash = 560
    h_splash = 237
    cust_splash = Image.new("RGBA", (w_splash, h_splash), TRANSPARENT)
    cust_splash.paste(logo_master, (0, 0), logo_master)
    cust_splash.save(os.path.join(cust_assets_dir, "splash.png"), "PNG")
    print("✓ Generated Customer splash.png (560x237, transparent logo icon)")

    # D. Customer Favicon (48x48)
    cust_fav = Image.new("RGBA", (48, 48), IVORY)
    fav_w = 42
    fav_h = int(237 * (fav_w / 560))
    scaled_fav = logo_master.resize((fav_w, fav_h), Image.Resampling.LANCZOS)
    cust_fav.paste(scaled_fav, ((48 - fav_w) // 2, (48 - fav_h) // 2), scaled_fav)
    cust_fav.save(os.path.join(cust_assets_dir, "favicon.png"), "PNG")
    print("✓ Generated Customer favicon.png (48x48)")

    # ==========================================
    # STAFF MOBILE ASSETS
    # ==========================================
    staff_assets_dir = os.path.join(repo_root, "apps", "staff-mobile", "assets")

    # Helper: Compose Staff Operational Logo with official Atlantic pill badge
    def compose_staff_logo(target_logo_width):
        logo_w = target_logo_width
        logo_h = int(237 * (logo_w / 560))
        s_logo = logo_master.resize((logo_w, logo_h), Image.Resampling.LANCZOS)

        pill_w = int(logo_w * 0.72)
        pill_h = int(logo_h * 0.22)
        spacing = int(pill_h * 0.35)
        total_h = logo_h + spacing + pill_h

        comp = Image.new("RGBA", (logo_w, total_h), TRANSPARENT)
        comp.paste(s_logo, (0, 0), s_logo)

        draw = ImageDraw.Draw(comp)
        pill_x0 = (logo_w - pill_w) // 2
        pill_y0 = logo_h + spacing
        pill_x1 = pill_x0 + pill_w
        pill_y1 = pill_y0 + pill_h
        radius = pill_h // 2
        draw.rounded_rectangle([pill_x0, pill_y0, pill_x1, pill_y1], radius=radius, fill=ATLANTIC)

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

    # A. Staff App Icon (1024x1024, Ivory bg)
    staff_comp_icon = compose_staff_logo(620)
    staff_icon = Image.new("RGBA", (1024, 1024), IVORY)
    staff_icon.paste(staff_comp_icon, ((1024 - staff_comp_icon.width) // 2, (1024 - staff_comp_icon.height) // 2), staff_comp_icon)
    staff_icon.save(os.path.join(staff_assets_dir, "icon.png"), "PNG")
    print("✓ Generated Staff icon.png (1024x1024)")

    # B. Staff Adaptive Icon (1024x1024, transparent bg, inside safe zone)
    staff_comp_adapt = compose_staff_logo(500)
    staff_adaptive = Image.new("RGBA", (1024, 1024), TRANSPARENT)
    staff_adaptive.paste(staff_comp_adapt, ((1024 - staff_comp_adapt.width) // 2, (1024 - staff_comp_adapt.height) // 2), staff_comp_adapt)
    staff_adaptive.save(os.path.join(staff_assets_dir, "adaptive-icon.png"), "PNG")
    print("✓ Generated Staff adaptive-icon.png (1024x1024, transparent)")

    # C. Staff Splash Screen Icon (expo-splash-screen standalone image, transparent bg)
    staff_splash_comp = compose_staff_logo(560)
    staff_splash_comp.save(os.path.join(staff_assets_dir, "splash.png"), "PNG")
    print(f"✓ Generated Staff splash.png ({staff_splash_comp.width}x{staff_splash_comp.height}, transparent)")

    # D. Staff Favicon (48x48)
    staff_fav_comp = compose_staff_logo(44)
    staff_fav = Image.new("RGBA", (48, 48), IVORY)
    staff_fav.paste(staff_fav_comp, ((48 - staff_fav_comp.width) // 2, (48 - staff_fav_comp.height) // 2), staff_fav_comp)
    staff_fav.save(os.path.join(staff_assets_dir, "favicon.png"), "PNG")
    print("✓ Generated Staff favicon.png (48x48)")

    print("\n--- All native branding assets successfully regenerated from committed master asset! ---")

if __name__ == "__main__":
    generate_branding()
