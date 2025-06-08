interface ProfileTemplateProps {
  children: React.ReactNode;
}

export const ProfileTemplate = ({ children }: ProfileTemplateProps) => {
  return <div className="min-h-screen">{children}</div>;
};
