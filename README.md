# XIAOHONGSHU MEDIA

Samodzielne archiwum GitHub Pages mediów THE BOYZ z Xiaohongshu. Motyw, kolorystyka, fonty, układ i galerie bazują bezpośrednio na repozytorium `INSTA POSTS ARCHIVE`.

## Funkcje

- osobne kafelki profili zgodne z głównymi folderami Google Drive,
- widoczny pusty kafelek `Jacob`, gotowy na przyszłe pliki,
- automatyczne tworzenie kolejnych kafelków po dodaniu nowych folderów głównych,
- poziomy kafelek `XHS Posts Related to TBZ`,
- filtrowanie każdej kolekcji według roku, a następnie miesiąca,
- domyślne otwieranie najnowszego dostępnego miesiąca i sortowanie od najnowszej daty `YYMMDD`,
- miniaturki zdjęć i filmów oraz linki `View` i `Download`,
- filmy otwierane bezpośrednio w odtwarzaczu Google Drive,
- nazwy plików widoczne w kolekcji `XHS Posts Related to TBZ`,
- automatyczna synchronizacja dwa razy dziennie.

## Uruchomienie lokalne

Wymagany jest Node.js 22 oraz pnpm.

```bash
pnpm install
pnpm dev
```

Test i kompilacja:

```bash
pnpm test
```

## Publikacja na GitHub Pages

1. Utwórz puste repozytorium GitHub, np. `xiaohongshu-media`.
2. Rozpakuj ZIP i w jego folderze wykonaj:

   ```bash
   git init -b main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TWOJ_LOGIN/xiaohongshu-media.git
   git push -u origin main
   ```

3. Otwórz `Settings → Pages`.
4. W `Build and deployment` wybierz `Source → GitHub Actions`.
5. Workflow `Deploy GitHub Pages` opublikuje stronę.

## Automatyczna synchronizacja

1. Udostępnij główny folder jako `Każda osoba mająca link → Wyświetlający`.
2. W projekcie Google Cloud włącz `Google Drive API`.
3. Utwórz klucz API ograniczony do Google Drive API.
4. W GitHub przejdź do `Settings → Secrets and variables → Actions`.
5. Dodaj sekret `GOOGLE_DRIVE_API_KEY`.
6. Uruchom `Actions → Sync Xiaohongshu Media → Run workflow`.

Synchronizacja działa codziennie o `05:17` i `17:17` UTC. Skanuje całe drzewo folderów rekurencyjnie, zachowuje puste foldery i automatycznie uwzględnia nowe foldery główne.

## Źródło

- [Folder Google Drive](https://drive.google.com/drive/folders/1nKIwoQ7qUZBszeQlQ384f5DhQiI4NS1_)
