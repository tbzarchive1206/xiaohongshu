import { useMemo, useState } from "react";

type Media = {
  id: string;
  kind: "image" | "audio" | "video" | "other";
  mimeType: string;
  date: number;
  year: number;
  month: number;
  name?: string;
};

type Collection = { id: string; name: string; media: Media[] };

export type Archive = {
  generatedAt: string;
  sourceFolderId: string;
  profiles: Collection[];
  special: Collection;
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pageSize = 28;
const thumbnail = (id: string, size = "w1200") => `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=${size}`;
const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${encodeURIComponent(id)}`;
const fileUrl = (id: string) => `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`;
const previewUrl = (id: string) => `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
const directUrl = (id: string) => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;

function MediaActions({ media, showName }: { media: Media; showName: boolean }) {
  return <div className="image-actions">
    {showName && <span className="file-name" title={media.name}>{media.name}</span>}
    <span className="file-action-links"><a href={fileUrl(media.id)} target="_blank" rel="noreferrer">VIEW ↗</a><a href={directUrl(media.id)} target="_blank" rel="noreferrer">DOWNLOAD ↓</a></span>
  </div>;
}

function MediaTile({ media, showName = false }: { media: Media; showName?: boolean }) {
  if (media.kind === "video") return <figure className="media-tile video-tile"><a className="xhs-video-link" href={fileUrl(media.id)} target="_blank" rel="noreferrer"><img src={thumbnail(media.id)} alt="" loading="lazy" /><span>VIDEO / OPEN IN GOOGLE DRIVE ↗</span></a><MediaActions media={media} showName={showName} /></figure>;
  if (media.kind === "audio") return <figure className="media-tile audio-tile"><div className="audio-mark" aria-hidden="true">AUDIO / XIAOHONGSHU</div><iframe src={previewUrl(media.id)} title="Xiaohongshu audio" allow="autoplay" loading="lazy" /><MediaActions media={media} showName={showName} /></figure>;
  if (media.kind !== "image") return <figure className="media-tile unsupported-media"><a className="unsupported-tile" href={fileUrl(media.id)} target="_blank" rel="noreferrer">OPEN FILE IN DRIVE ↗</a><MediaActions media={media} showName={showName} /></figure>;
  return <figure className="media-tile"><a href={fileUrl(media.id)} target="_blank" rel="noreferrer" aria-label="Open original image in Google Drive"><img src={thumbnail(media.id)} alt="" loading="lazy" /></a><MediaActions media={media} showName={showName} /></figure>;
}

export function XiaohongshuArchive({ data }: { data: Archive }) {
  const now = new Date();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [shown, setShown] = useState(pageSize);
  const totalMedia = data.profiles.reduce((sum, item) => sum + item.media.length, 0) + data.special.media.length;
  const years = useMemo(() => collection ? [...new Set(collection.media.map((item) => item.year))].filter(Boolean).sort((a, b) => b - a) : [], [collection]);
  const months = useMemo(() => collection ? [...new Set(collection.media.filter((item) => item.year === year).map((item) => item.month))].filter(Boolean).sort((a, b) => b - a) : [], [collection, year]);
  const media = useMemo(() => collection ? collection.media.filter((item) => item.year === year && item.month === month).sort((a, b) => b.date - a.date) : [], [collection, month, year]);

  const chooseCollection = (next: Collection) => {
    const latest = next.media[0];
    setCollection(next);
    setYear(latest?.year || now.getFullYear());
    setMonth(latest?.month || now.getMonth() + 1);
    setShown(pageSize);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <main id="top">
    <header className="masthead">
      <div className="utility"><a className="brand" href="https://tbzarchive1206.github.io/tbzarchive/">THE BOYZ / FAN ARCHIVE</a><nav><span>XIAOHONGSHU MEDIA</span><span>/</span><a href="https://x.com/tbzarchive1206_" target="_blank" rel="noreferrer">TWITTER ↗</a></nav></div>
      <h1><span className="solid">XIAOHONGSHU</span><span className="outline">MEDIA</span></h1>
      <div className="stats"><p><strong>{data.profiles.length + 1}</strong> COLLECTIONS</p><i /><p><strong>{totalMedia.toLocaleString("en-US")}</strong> MEDIA FILES</p><i /><p>UPDATED <strong>{new Date(data.generatedAt).toLocaleDateString("en-GB")}</strong></p></div>
    </header>

    {!collection ? <section className="member-picker insta-picker xhs-picker">
      <div className="picker-head"><p>SELECT A PROFILE · {data.profiles.length} PROFILES</p><a href={folderUrl(data.sourceFolderId)} target="_blank" rel="noreferrer">OPEN SOURCE FOLDER ↗</a></div>
      <div className={`member-grid profile-count-${data.profiles.length}`}>{data.profiles.map((item, index) => <button key={item.id} onClick={() => chooseCollection(item)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name.toUpperCase()}</strong><small>{item.media.length.toLocaleString("en-US")} MEDIA FILES →</small></button>)}</div>
      <button className="other-profile-tile" onClick={() => chooseCollection(data.special)}><span>{String(data.profiles.length + 1).padStart(2, "0")} / SPECIAL COLLECTION</span><strong>XHS POSTS RELATED TO TBZ</strong><em>THE BOYZ 相关小红书内容</em><small>{data.special.media.length.toLocaleString("en-US")} MEDIA FILES →</small></button>
    </section> : <section className="member-gallery insta-gallery">
      <header className="member-gallery-head"><button onClick={() => setCollection(null)}>← ALL PROFILES</button><div><span>XIAOHONGSHU MEDIA / PROFILE</span><h2>{collection.name.toUpperCase()}</h2></div><a href={folderUrl(collection.id)} target="_blank" rel="noreferrer">OPEN FOLDER ↗</a></header>
      <div className="member-filters"><label>YEAR<select value={year} onChange={(event) => { const nextYear = Number(event.target.value); setYear(nextYear); const nextMonths = [...new Set(collection.media.filter((item) => item.year === nextYear).map((item) => item.month))].sort((a, b) => b - a); if (!nextMonths.includes(month)) setMonth(nextMonths[0] || 1); setShown(pageSize); }}>{years.map((value) => <option key={value}>{value}</option>)}</select></label><label>MONTH<select value={month} onChange={(event) => { setMonth(Number(event.target.value)); setShown(pageSize); }}>{monthNames.map((name, index) => <option key={name} value={index + 1} disabled={!months.includes(index + 1)}>{String(index + 1).padStart(2, "0")} · {name.toUpperCase()}</option>)}</select></label><p>{media.length} RESULTS</p></div>
      <div className="member-period"><p>{monthNames[month - 1]} {year}</p><span>NEWEST FIRST</span></div>
      {media.length ? <div className="media-grid">{media.slice(0, shown).map((item) => <MediaTile key={item.id} media={item} showName={collection.id === data.special.id} />)}</div> : <div className="empty member-empty"><strong>NO MEDIA</strong>THERE ARE NO UPLOADS FOR THIS MONTH.</div>}
      {shown < media.length && <button className="load-more" onClick={() => setShown((value) => value + pageSize)}>LOAD MORE MEDIA ↓</button>}
    </section>}
    <footer><span>© THE BOYZ FAN ARCHIVE</span><a href={folderUrl(data.sourceFolderId)} target="_blank" rel="noreferrer">SOURCE FOLDER ↗</a><a href="#top">BACK TO TOP ↑</a></footer>
  </main>;
}
