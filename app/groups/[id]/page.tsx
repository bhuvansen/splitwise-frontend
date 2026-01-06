
import GroupDetailsClient from "@/components/groups/GroupDetailsClient"
import { getGroupDetailsPageProps, getGroupExpenses } from "@/lib/serverCall/groupDetailsPageCalls"

export default async function GroupDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params

    const [{ members }, expenses] = await Promise.all([getGroupDetailsPageProps(id), getGroupExpenses(id)])

    return <GroupDetailsClient groupId={id} members={members} expenses={expenses} />
}
