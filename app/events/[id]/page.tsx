import { notFound } from "next/navigation";

async function getEventData(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`);

    if (!res.ok) {
        return null;
    }

    return res.json();
}

export default async function EventDetails({ params }: { params: { id: string } }) {
    const event = await getEventData(params.id);

    if (!event) {
        notFound();
    }

    return (
        <div className="p-4">
            <h1 className="font-bold text-3xl">{event.name}</h1>
            <p>{event.description}</p>
        </div>
    );
}