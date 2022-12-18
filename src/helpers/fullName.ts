const defaultValues = {
  first_name: 'Name',
  last_name: 'Surname',
};

export function getFullName({
  first_name,
  last_name,
}: {
  first_name?: string;
  last_name?: string;
}) {
  const firstName = first_name || defaultValues.first_name;
  const lastName = last_name || defaultValues.last_name;
  return `${firstName} ${lastName}`;
}
