import { User } from "lucide-react";
import { EmptyContent } from "@/components/empty-content";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ProfileCard } from "../components/card";
import { useProfileQuery } from "../hooks/use-profile-query";

export function ProfileList() {
  const query = useProfileQuery();

  const flatItems = query.data?.pages.flatMap((page) => page.items) ?? [];
  const isEmpty = flatItems.length === 0 && !query.isLoading;

  return (
    <InfiniteScroll
      onLoadMore={query.fetchNextPage}
      hasNextPage={query.hasNextPage}
      isFetchingNextPage={query.isFetchingNextPage}
      isLoading={query.isLoading}
      className="gap-4 p-4"
    >
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {flatItems.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>

      <EmptyContent
        show={isEmpty}
        icon={User}
        title="No profiles found"
        description="Try adjusting your filters or search query."
      />
    </InfiniteScroll>
  );
}
