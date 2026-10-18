# Art direction and continuity — H01

## Visual concept

**Retro educational, 1998 technology.** Components personified with faces and gloves; neutral paper background. No contemporary computers, ultrathin displays, NVMe SSDs, UEFI chips, phone designs or modern boot iconography.

## Visual system

| Variable | Value |
|---|---|
| Master size | Scalable SVG, `viewBox="0 0 512 512"` |
| Background | Transparent for each character |
| Outline | Slate blue `#22344A` |
| Main stroke width | 8–9 SVG units |
| Shape | Simple geometry, rounded corners and minimal texture |
| Aesthetic | Flat vector with controlled shadows |
| Scene palette | Paper `#F4F0E9`, ink `#1A2E45` |
| Hardware | Petroleum blue / board green |
| Firmware | Muted violet |
| Data | Amber gold |
| Software | Blue / soft green |
| Base position | Ground around Y=455 |

## Standard expressions

- `neutral`: smile, resting pose.
- `hablando`: open mouth and raised right arm; alternate with `neutral` while speaking.
- `alerta`: worried/surprised expression for negative results or failures.

## Continuity rules

1. Each mascot retains its silhouette, main color, connector count and internal labels in every scene.
2. Do not change names: M01 Voltio; M02 Pulso; M03 Secu; M04 Cipu; M05 Romi; M06 Bios; M07 Cmosi; M08 Spedi; M09 Rami; M10 Postín; M11 Disqui; M12 Mebre; M13 Grubi; M14 Núcleo; M15 Init.
3. **Romi** represents the BIOS flash (hardware) and **Bios** represents the code (firmware). Never interchange their roles.
4. **Postín** represents a POST routine; it is not a physical sensor.
5. **Mebre** represents the MBR sector and its contents; it is not an entire disk.
6. **Cmosi** represents CMOS/RTC storage in the historical machine, not firmware.
7. **Spedi** is a small EEPROM associated with an SDRAM DIMM, not main memory.
8. **Grubi** represents GRUB Legacy and its stages, not modern GRUB in a UEFI environment.
9. The Pentium II design uses a Slot 1 cartridge silhouette, not a modern LGA chip.
10. **Núcleo** and **Init** appear at the end of the sequence, not before the bootloader.

## Technical note for vector editing

The illustrations are SVGs with groups `id="extremidades"`, `id="cuerpo"` and `id="rostro"`. This helps Codex/Claude separate layers if independent animation is chosen later. The first implementation avoids dynamic DOM/SVG manipulation within Remotion: each expression is a standalone file.

## Production policy

The cast's eye contact does not replace technical documentation. Before animating each scene, its data contract, dialogue, signal or structure to represent, and acceptance criterion must exist. The total 5–6-minute duration is controlled in another phase.
