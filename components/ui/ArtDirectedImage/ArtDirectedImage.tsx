import { getImageProps, type StaticImageData } from 'next/image';

interface Props {
  alt: string;
  base: StaticImageData;
  at960?: StaticImageData;
  at1440?: StaticImageData;
  loading?: 'eager' | 'lazy';
  className?: string;
}

// Figma exports are @2x, so each image renders at half its pixel width and gets a 1x/2x srcset.
function imageProps(src: StaticImageData, alt: string, loading: Props['loading']) {
  return getImageProps({ src, alt, width: src.width / 2, loading }).props;
}

export function ArtDirectedImage({ alt, base, at960, at1440, loading, className }: Props) {
  const sources = [
    { media: '(min-width: 1440px)', src: at1440 },
    { media: '(min-width: 960px)', src: at960 },
  ];

  return (
    <picture>
      {sources.map(({ media, src }) => {
        if (!src) return null;
        const { srcSet, width, height } = imageProps(src, alt, loading);
        return <source key={media} media={media} srcSet={srcSet} width={width} height={height} />;
      })}
      <img {...imageProps(base, alt, loading)} alt={alt} className={className} />
    </picture>
  );
}
