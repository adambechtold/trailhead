import Image from 'next/image';

export default function Map() {
    return (
        <Image
            alt="Trail Map"
            src="/images/trail-map.jpeg"
            layout="fill"
            objectFit="contain"
        />
    )
}