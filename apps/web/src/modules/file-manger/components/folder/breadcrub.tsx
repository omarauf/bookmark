import React from "react";
import { useShallow } from "zustand/shallow";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useStore } from "../../store";
import { getAllInceptors } from "../../utils/file-utils";

export function FolderBreadcrumb() {
  const [tree, currentFolderId, handleFolderChange] = useStore(
    useShallow((s) => [s.fileTree, s.currentFolderId, s.handleFolderChange]),
  );

  const inceptors = getAllInceptors(tree, currentFolderId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {inceptors.map((item, index) => {
          const isLast = index === inceptors.length - 1;
          return (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => handleFolderChange(item.id)}
                  className="cursor-pointer"
                >
                  {item.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
