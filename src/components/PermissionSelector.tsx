import React from "react";

interface PermissionSelectorProps {
  selected: string[];
  availablePermissions: string[];
  onChange: (updatedPermissions: string[]) => void;
}

export default function PermissionSelector({
  selected = [],
  onChange,
  availablePermissions = [],
}: PermissionSelectorProps) {
  const togglePermission = (permission: string) => {
    if (selected.includes(permission)) {
      onChange(selected.filter((p) => p !== permission));
    } else {
      onChange([...selected, permission]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Permissões:</label>
      <div className="grid grid-cols-2 gap-2">
        {availablePermissions.map((perm: string) => (
          <label key={perm} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(perm)}
              onChange={() => togglePermission(perm)}
            />
            {perm.replace(/_/g, " ")}
          </label>
        ))}
      </div>
    </div>
  );
}
