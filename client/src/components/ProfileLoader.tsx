import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="mx-auto min-h-screen md:w-10/12">
      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute inset-0 h-32 border-2 bg-gradient-to-br" />
        <div className="relative px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center sm:flex-row sm:space-x-6">
            <Skeleton className="h-32 w-32 rounded-full border" />
            <Skeleton />
            <div className="mt-4 space-y-2 text-center sm:mt-0 sm:text-left">
              <div className="flex items-center justify-center space-x-4 sm:justify-start">
                <Skeleton className="h-10 w-40 rounded-lg" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

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
