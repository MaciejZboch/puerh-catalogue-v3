export default function EditTeaButton ({teaId, userId} : {teaId: string, userId: string}) {
    return <a href={`/edit/${teaId}?user=${userId}`}className="text-green-soft rounded-xl ml-4 py-2 px-4 mx-4">Edit</a>
}