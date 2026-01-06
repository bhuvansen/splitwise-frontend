import GroupsPageClient from "@/components/GroupsPageClient"
import { getGroupPageProps } from "@/lib/serverCall/groupPageCalls"

export default async function GroupsPage() {
    const { groups } = await getGroupPageProps()

    return <GroupsPageClient groups={groups} />
}
