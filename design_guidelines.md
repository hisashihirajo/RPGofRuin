# RPG Game Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern RPG interfaces like Final Fantasy XIV, Genshin Impact, and Persona series, adapted for a post-apocalyptic aesthetic reflecting the war-torn, mutation-affected world.

## Core Design Elements

### Color Palette
**Dark Mode Primary** (matching the dystopian setting):
- Primary: 220 15% 12% (deep slate background)
- Secondary: 15 25% 25% (rust brown, war-torn metal)
- Accent: 280 60% 65% (mutation purple, representing the transformative elements)
- Text: 210 20% 85% (light gray)
- Success: 120 40% 50% (muted green)
- Warning: 30 80% 55% (amber)
- Danger: 0 70% 55% (crimson)

**Light Mode** (for contrast):
- Primary: 210 15% 95% (off-white)
- Secondary: 15 20% 80% (warm beige)
- Accent: 280 50% 45% (darker mutation purple)

### Typography
- **Headers**: "Cinzel" (Google Fonts) - fantasy/RPG aesthetic
- **Body**: "Inter" (Google Fonts) - clean readability
- **UI Elements**: "JetBrains Mono" (Google Fonts) - for stats/numbers

### Layout System
Tailwind spacing primitives: 2, 4, 6, 8, 12, 16
- Base padding: p-4
- Section spacing: gap-8, mb-12
- Card spacing: p-6
- Button spacing: px-4 py-2

### Component Library
**Core UI Elements:**
- Character cards with portrait, stats, and ability preview
- Combat interface with turn order display
- Inventory grid system with item tooltips
- Dialogue boxes with character portraits
- World map with location markers
- Progress bars for health/mana/experience

**Navigation:**
- Top navigation bar with game logo and main menu
- Side panel for character status and quick actions
- Modal overlays for detailed character/item views

**Forms:**
- Character creation wizard
- Settings panels with dark theme controls
- Save/load game interfaces

### Visual Themes
**Post-Apocalyptic Aesthetic:**
- Weathered textures and worn metal effects
- Subtle particle effects for mutation elements
- Muted color transitions reflecting the world's decay
- Clean modern UI overlaid on dystopian imagery

### Images
**Hero Section:** Large atmospheric artwork showing the war-torn world with silhouettes of characters (Chris, Sora, Alex) against a devastated cityscape. Mutation energy should be visible as purple/violet energy wisps.

**Character Portraits:** Anime-style character art for each main character, showing their post-war appearance and any mutation effects.

**World Map Background:** Overview of the devastated world with key locations marked, showing both human settlements and mutated zones.

**Combat Backgrounds:** Various battlefield scenes reflecting different areas of the post-apocalyptic world.

### Accessibility
- High contrast ratios maintained across all color combinations
- Focus indicators for keyboard navigation
- Screen reader friendly labels for all interactive elements
- Consistent dark mode implementation throughout

### Key Design Principles
1. **Narrative Integration**: UI elements should reinforce the story's themes of survival and transformation
2. **Character Focus**: Prominent display of character relationships and development
3. **World Immersion**: Visual elements should consistently reflect the post-war, mutation-affected setting
4. **Functional Clarity**: Despite thematic elements, gameplay functions must remain clear and accessible