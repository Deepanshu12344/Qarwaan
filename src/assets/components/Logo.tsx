const logoFixedClass = 'inline-block h-8 w-[96px] md:h-10 md:w-[120px]';
const logoNaturalClass = 'inline-block h-8 w-auto md:h-10 md:w-auto';
const logoAspectRatio = '11806 / 5015';

type LogoTone = 'light' | 'teal';
type LogoSize = 'fixed' | 'natural';

type LogoProps = {
  tone?: LogoTone;
  size?: LogoSize;
  className?: string;
};

function joinClassNames(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Logo({ tone = 'light', size = 'natural', className }: LogoProps) {
  const baseClass = size === 'fixed' ? logoFixedClass : logoNaturalClass;

  if (tone === 'light') {
    return (
      <img
        src="/qarwaan-logo-light.png"
        alt="Qarwaan"
        className={joinClassNames(baseClass, className)}
        loading="eager"
      />
    );
  }

  return (
    <span
      role="img"
      aria-label="Qarwaan"
      className={joinClassNames(baseClass, className)}
      style={{
        backgroundColor: '#004643',
        WebkitMaskImage: "url('/qarwaan-logo-dark.png')",
        maskImage: "url('/qarwaan-logo-dark.png')",
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        aspectRatio: logoAspectRatio,
      }}
    />
  );
}
