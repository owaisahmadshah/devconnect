import { createFileRoute } from '@tanstack/react-router';
import { Posts } from '@/features/post/components/Posts';

export const Route = createFileRoute('/')({
  component: Posts,
});

// function Index() {
//   return (
//     <div className="p-2">
//       <h3>Welcome Home!</h3>
//     </div>
//   );
// }
