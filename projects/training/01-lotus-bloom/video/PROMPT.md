# Higgsfield: поворот флакона на 360° (для сцены 01)

**Где:** Higgsfield → Video → Create Video (image-to-video). Модель: Kling 3.0 (или Veo 3). Формат 9:16, 1080p, 8–10 с, без звука.
**Первый кадр:** `start-frame.jpg` (флакон на чистом зелёном #00FF00 — потом вырезаем в шейдере).

**Промпт:**
> Turntable product shot. The ruby crystal perfume flacon slowly rotates exactly 360 degrees around its vertical axis at a constant speed, ending in the same position it started. Camera completely locked, no zoom, no tilt. Flat solid pure green chroma key background (#00FF00) stays perfectly uniform, no shadows, no reflections on the background, no props. Facets catch soft highlights as it turns; gold collar and faceted ruby stopper stay attached and unchanged. Photoreal, sharp, no text.

**Негатив (если есть поле):** camera movement, background change, extra objects, melting, shape change, cap changing, text, logo.

**Проверка перед отправкой мне:** разобрать на кадры (каждые 0,5 с) — форма пробки и ободка не меняется, оборот ровно один, фон везде однородно зелёный.

**Что сделаю я, когда видео будет:** положить файл как `img/flacon-turn.mp4` → код уже готов: включится видео вместо фото, зелёный вырезается в шейдере, а время видео привязано к прокрутке (при подъёме флакон делает полный оборот), плюс webm и 540p-версии для телефона.
