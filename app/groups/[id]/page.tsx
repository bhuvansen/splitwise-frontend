
import GroupDetailsClient from "@/components/groups/GroupDetailsClient"
import { getCurrentEmailId } from "@/lib/auth";
import { getGroupDetailsPageProps, getGroupExpenses, getSettlements } from "@/lib/serverCall/groupDetailsPageCalls"

export default async function GroupDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params
const currentEmailId = await getCurrentEmailId();

    const [{ members }, expenses, settlements] = await Promise.all([getGroupDetailsPageProps(id), getGroupExpenses(id), getSettlements(id)])
   
    return <GroupDetailsClient groupId={id} members={members} expenses={expenses} currentEmailId={currentEmailId} settlements={settlements} />
}
