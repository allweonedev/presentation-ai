import PresentationPage from "@/components/presentation/core/PresentationPage";
import {
  getDocumentAccessForUser,
  getSessionIdentity,
} from "@/server/share/authorization";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { userId, userEmail } = await getSessionIdentity();
  const access = await getDocumentAccessForUser(params.id, userId, userEmail);

  if (!access.canRead) {
    notFound();
  }

  return <PresentationPage readOnly={!access.canEdit} />;
}
