import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="mx-auto min-h-screen md:w-10/12">
      {/* Header Skeleton */}
      <Card className="border-border bg-card relative mx-auto mb-6 overflow-hidden border shadow-md md:w-10/12">
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Profile Picture Skeleton */}
            <div className="relative shrink-0">
              <Skeleton className="h-32 w-32 rounded-full sm:h-36 sm:w-36" />
            </div>

            {/* Profile Info Skeleton */}
            <div className="w-full min-w-0 flex-1 space-y-4 text-center sm:text-left">
              {/* Name and Edit Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3 sm:justify-start">
                  <Skeleton className="h-9 w-48 sm:w-64" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                {/* Role Badge */}
                <div className="flex justify-center sm:justify-start">
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2 pt-2">
                <Skeleton className="mx-auto h-4 w-full max-w-2xl sm:mx-0" />
                <Skeleton className="mx-auto h-4 w-3/4 max-w-xl sm:mx-0" />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 pt-2 sm:justify-start">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="bg-border h-10 w-px" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Card */}
      <div className="space-y-3">
        <Card className="mx-auto w-10/12">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">
              <Skeleton className="h-8 w-44" />
            </CardTitle>
            <div className="flex gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-12 w-44" />
            <Skeleton className="h-12 w-44" />
          </CardContent>
        </Card>

        <Card className="mx-auto w-10/12">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">
              <Skeleton className="h-8 w-44" />
            </CardTitle>
            <div className="flex gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </CardHeader>
        </Card>

        <Card className="mx-auto w-10/12">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">
              <Skeleton className="h-8 w-44" />
            </CardTitle>
            <div className="flex gap-3">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
