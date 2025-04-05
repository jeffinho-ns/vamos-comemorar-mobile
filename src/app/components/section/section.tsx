import Image from "next/image";

interface SectionProps {
  title: string;
  image: string;
  onClick: (src: string) => void;
}

const Section: React.FC<SectionProps> = ({ title, image, onClick }) => {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <div
        onClick={() => onClick(image)}
        className="overflow-hidden rounded-lg cursor-pointer"
      >
        <Image src={image} alt={title} width={400} height={250} className="object-cover w-full" />
      </div>
    </div>
  );
};

export default Section;
