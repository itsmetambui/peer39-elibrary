import { useQuery } from "@tanstack/react-query";
import { useCombobox, useMultipleSelection } from "downshift";
import { forwardRef, useMemo, useState } from "react";

import { getAuthors } from "@/apis/author";
import { badgeVariants } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export interface AuthorAutocompleteProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value: string[];
  onChange: (value: string[]) => void;
}

const AuthorAutocomplete = forwardRef<
  HTMLInputElement,
  AuthorAutocompleteProps
>(({ value: selectedItems, onChange, ...props }, ref) => {
  const [inputValue, setInputValue] = useState("");

  const { data: options = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: getAuthors,
  });

  const items = useMemo(
    function getFilteredItems() {
      const lowerCasedInputValue = inputValue.toLowerCase();

      return options.filter(function filterItem(item) {
        return (
          !selectedItems.includes(item.id) &&
          item.fullName.toLowerCase().includes(lowerCasedInputValue)
        );
      });
    },
    [selectedItems, inputValue, options]
  );
  const { getSelectedItemProps, getDropdownProps, removeSelectedItem } =
    useMultipleSelection({
      selectedItems,
      onStateChange({ selectedItems: newSelectedItems = [], type }) {
        switch (type) {
          case useMultipleSelection.stateChangeTypes
            .SelectedItemKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
          case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
          case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
            onChange(newSelectedItems);
            break;
          default:
            break;
        }
      },
    });
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.id : "";
    },
    defaultHighlightedIndex: 0, // after selection, highlight the first item.
    selectedItem: null,
    inputValue,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
            highlightedIndex: 0, // with the first option highlighted.
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          if (newSelectedItem) {
            onChange([...selectedItems, newSelectedItem.id]);
            setInputValue("");
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue || "");

          break;
        default:
          break;
      }
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        <div className="min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 inline-flex gap-2 items-center flex-wrap">
          {selectedItems.map(function renderSelectedItem(
            selectedItemForRender,
            index
          ) {
            return (
              <span
                className={badgeVariants({ variant: "secondary" })}
                key={`selected-item-${index}`}
                {...getSelectedItemProps({
                  selectedItem: selectedItemForRender,
                  index,
                })}
              >
                {
                  options.find((opt) => opt.id === selectedItemForRender)
                    ?.fullName
                }
                <span
                  className="px-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(selectedItemForRender);
                  }}
                >
                  &#10005;
                </span>
              </span>
            );
          })}
          <div className="flex items-center gap-0.5 grow">
            <input
              placeholder="Select authors..."
              className="w-full outline-none placeholder:text-muted-foreground text-sm"
              {...getInputProps({
                ...props,
                ...getDropdownProps({ preventKeyAction: isOpen }),
              })}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="h-4 w-4 p-0" variant="link" asChild>
                  <Link href="/authors/add">
                    <CirclePlus size="16" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new author</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="relative mt-2">
        <div
          className={`absolute h-40 top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none ${
            !(isOpen && items.length) && "hidden"
          }`}
          {...getMenuProps()}
        >
          <ScrollArea className="h-40 w-full">
            {isOpen &&
              items.map((item, index) => (
                <li
                  className={cn(
                    "relative flex cursor-pointer select-none items-start rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    highlightedIndex === index && "bg-blue-300",
                    selectedItem === item && "font-bold",
                    "py-2 px-3 shadow-sm flex flex-col"
                  )}
                  key={`${item.id}${index}`}
                  {...getItemProps({ item, index })}
                >
                  <span>{item.fullName}</span>
                </li>
              ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
});

AuthorAutocomplete.displayName = "AuthorAutocomplete";

export { AuthorAutocomplete };
