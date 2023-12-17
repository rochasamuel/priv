import { FunctionComponent, HTMLProps, ReactElement } from "react";

interface IconInputProps extends HTMLProps<HTMLInputElement> {
  icon: ReactElement;
  position?: "left" | "right";
}
 
const IconInput: FunctionComponent<IconInputProps> = ({ icon, position, ...props }) => {
  return ( <div
    className={"flex h-10 w-full items-center rounded-md border border-input bg-transparent pl-3 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"}
  >
    {icon}
    <input
      className="w-full bg-transparent p-2 placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  </div> );
}
 
export default IconInput;