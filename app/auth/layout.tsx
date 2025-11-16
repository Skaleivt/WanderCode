type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  return <main>{children}</main>;
}
