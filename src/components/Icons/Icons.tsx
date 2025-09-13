type IconType = {
  fill: string;
  width: string;
  height: string;
  className?: string;
};

const ArrowDown = ({ fill, width, height, className }: IconType) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className} fill={fill} viewBox="0 0 24 24">
      <path d="M8.12 9.29 12 13.17l3.88-3.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-4.59 4.59c-.39.39-1.02.39-1.41 0L6.7 10.7c-.39-.39-.39-1.02 0-1.41.39-.38 1.03-.39 1.42 0z" />
    </svg>
  );
};

const KeyboardBackspace = ({ fill, width, height, className }: IconType) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className} fill={fill} viewBox="0 0 24 24">
      <path d="M20 11H6.83l2.88-2.88c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L3.71 11.3c-.39.39-.39 1.02 0 1.41L8.3 17.3c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L6.83 13H20c.55 0 1-.45 1-1s-.45-1-1-1z" />
    </svg>
  );
};

export { ArrowDown, KeyboardBackspace };
