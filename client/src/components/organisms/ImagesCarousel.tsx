import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Download from 'yet-another-react-lightbox/plugins/download';
import Inline from 'yet-another-react-lightbox/plugins/inline';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

interface ImagesCarouselProps {
  url: string;
  mediaType: string;
}

export const ImagesCarousel = ({
  images,
  openImages = true,
}: {
  images: ImagesCarouselProps[];
  openImages?: boolean;
}) => {
  const slides = images.map(image => ({ src: image.url }));

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const toggleOpen = (state: boolean) => () => {
    if (openImages) setOpen(state);
  };

  const updateIndex = ({ index: current }: { index: number }) => {
    setIndex(current);
  };

  if (images.length === 1) {
    return (
      <div className="relative mx-auto w-full max-w-[900px] cursor-zoom-in">
        <Lightbox
          index={index}
          slides={slides}
          plugins={[Inline, Counter]}
          on={{
            view: updateIndex,
            click: toggleOpen(true),
          }}
          counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
          carousel={{
            padding: 0,
            spacing: 0,
            imageFit: 'cover',
            finite: images.length <= 1,
          }}
          inline={{
            style: {
              width: '90%',
              maxWidth: '900px',
              aspectRatio: '3 / 2',
              margin: '0 auto',
            },
          }}
          styles={{
            container: {
              backgroundColor: 'transparent',
            },
          }}
        />

        {/* Fullscreen lightbox */}
        <Lightbox
          open={open && openImages}
          close={toggleOpen(false)}
          plugins={[Counter, Download, Zoom]}
          index={index}
          slides={slides}
          on={{ view: updateIndex }}
          animation={{ fade: 250 }}
          controller={{
            closeOnPullDown: true,
            closeOnBackdropClick: true,
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="cursor-zoom-in">
        <Lightbox
          index={index}
          slides={slides}
          plugins={[Inline, Counter]}
          on={{
            view: updateIndex,
            click: toggleOpen(true),
          }}
          counter={{
            container: {
              style: {
                top: 'unset',
                bottom: '12px',
                right: '12px',
                left: 'unset',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '20px',
                padding: '2px 10px',
                fontSize: '11px',
              },
            },
          }}
          carousel={{
            padding: 0,
            spacing: 0,
            imageFit: 'cover',
          }}
          inline={{
            style: {
              width: '100%',
              aspectRatio: '16 / 10',
              maxHeight: '600px',
            },
          }}
          styles={{
            container: {
              backgroundColor: 'transparent',
            },
          }}
        />
      </div>

      <Lightbox
        open={open}
        close={toggleOpen(false)}
        plugins={[Counter, Download, Zoom]}
        index={index}
        slides={slides}
        on={{ view: updateIndex }}
        animation={{ fade: 300 }}
        controller={{
          closeOnPullDown: true,
          closeOnBackdropClick: true,
        }}
        styles={{
          root: { '--yarl__color_backdrop': 'rgba(0, 0, 0, .95)' },
        }}
      />
    </div>
  );
};
