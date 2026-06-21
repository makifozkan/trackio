import { Button } from './buttons';
import { Input } from './inputs';

export function SearchBar() {
  return (
    <div className="w-auto">
      <Input label="Search ideas..." />
      <Button title="Search" />
    </div>
  );
}
