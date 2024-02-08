import {
  FormControl,
  FormLabel,
  Input as CHInput,
  FormErrorMessage,
  Textarea,
  FormHelperText,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useColorModeValue,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { type HTMLInputTypeAttribute, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface FormControlInputProps {
  type: HTMLInputTypeAttribute;
  isRequired?: boolean;
  name: string;
  label?: string | React.ReactNode;
  disabled?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  othersSettings?: Record<string, string>;
  options?: { value: string; label: string }[];
}

const PrimaryInput = (props: FormControlInputProps) => {
  const {
    type,
    isRequired = false,
    name,
    label,
    disabled,
    min,
    max,
    placeholder,
    leftElement: leftElement,
    rightElement: rightElement,
    othersSettings,
  } = props;
  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext();
  const error = _.get(errors, name);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const value = watch(name);

  const mainInnerColor = useColorModeValue("var(--black-primary)", "white");
  const textInputColor = useColorModeValue(
    "var(--input-light)",
    "var(--dark-hover)"
  );
  const outlineClickColor = useColorModeValue(
    "var(--input-dark)",
    "var(--dark-bg)"
  );

  // const borderColor = useColorModeValue(
  //   "var(--light-border)",
  //   "var(--dark-border)"
  // );

  const hoverInputColor = useColorModeValue(
    "var(--light-border-hover)",
    "var(--dark-border-hover)"
  );

  const [inputType, setInputType] = useState<string>(type);
  const passwordClick = () => {
    if (type === "password") {
      if (inputType === "password") {
        setInputType("text");
      } else {
        setInputType("password");
      }
    }
  };

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      {label && (
        <FormLabel
          fontSize={"md"}
          fontFamily={"Inter-Regular"}
          mb={0}
          htmlFor={name}
        >
          {label}
        </FormLabel>
      )}
      {type === "textarea" ? (
        <Textarea
          placeholder={placeholder}
          rows={5}
          {...register(name, {
            required: isRequired,
            valueAsNumber: type === "number",
            disabled,
            minLength: min
              ? {
                  value: min,
                  message: `La lunghezza minima è di ${min} caratteri`,
                }
              : undefined,
            maxLength: max
              ? {
                  value: max,
                  message: `La lunghezza massima è di ${max} caratteri`,
                }
              : undefined,
          })}
          borderRadius={"lg"}
          _hover={{
            borderColor: hoverInputColor,
          }}
          _focusVisible={{
            borderColor: hoverInputColor,
          }}
          size={"lg"}
          fontFamily={"Inter-Regular"}
          border={"1px solid"}
          borderColor={"#e4e4e4"}
          _focus={{
            borderColor: "var(--black-primary)",
            boxShadow: "0 0 0 1px var(--black-primary)",
          }}
        />
      ) : (
        <>
          {rightElement ? (
            <InputGroup
              minW={{
                base: "100%",
                xl: "md",
              }}
              size="lg"
              border={"2px solid transparent"}
              bg={"gray.200"}
              borderRadius={"full"}
            >
              <CHInput
                placeholder={placeholder}
                type={type}
                {...othersSettings}
                {...register(name, {
                  required: isRequired,
                  valueAsNumber: type === "number",
                  disabled,
                  minLength: min
                    ? {
                        value: min,
                        message: `La lunghezza minima è di ${min} caratteri`,
                      }
                    : undefined,
                  maxLength: max
                    ? {
                        value: max,
                        message: `La lunghezza massima è di ${max} caratteri`,
                      }
                    : undefined,
                })}
                borderRadius={"full"}
                autoComplete="off"
                outline="3px solid transparent"
                transition={"all 0.2s"}
                _focusVisible={{
                  outline: "3px solid #090a22",
                }}
                size={"lg"}
                fontFamily={"Inter-Regular"}
                border={"1px solid"}
                borderColor={"#e4e4e4"}
                _focus={{
                  borderColor: "var(--black-primary)",
                  boxShadow: "0 0 0 1px var(--black-primary)",
                }}
              />
              {rightElement}
              <InputRightElement pointerEvents="none" color={mainInnerColor}>
                {rightElement}
              </InputRightElement>
            </InputGroup>
          ) : leftElement ? (
            <InputGroup
              minW={{
                base: "100%",
                xl: "md",
              }}
              size="lg"
              outline={`3px solid ${textInputColor}`}
              bg={textInputColor}
              borderRadius={"full"}
            >
              <InputLeftElement pointerEvents="none" color={mainInnerColor}>
                {leftElement}
              </InputLeftElement>
              <CHInput
                placeholder={placeholder}
                type={type}
                {...othersSettings}
                {...register(name, {
                  required: isRequired,
                  valueAsNumber: type === "number",
                  disabled,
                  minLength: min
                    ? {
                        value: min,
                        message: `La lunghezza minima è di ${min} caratteri`,
                      }
                    : undefined,
                  maxLength: max
                    ? {
                        value: max,
                        message: `La lunghezza massima è di ${max} caratteri`,
                      }
                    : undefined,
                })}
                borderRadius={"full"}
                autoComplete="off"
                outline="3px solid transparent"
                transition={"all 0.2s"}
                _focusVisible={{
                  outline: `3px solid ${outlineClickColor}`,
                }}
                size={"lg"}
                fontFamily={"Inter-Regular"}
                border={"1px solid"}
                borderColor={"#e4e4e4"}
                _focus={{
                  borderColor: "var(--black-primary)",
                  boxShadow: "0 0 0 1px var(--black-primary)",
                }}
              />
            </InputGroup>
          ) : (
            <InputGroup>
              <CHInput
                bg={"transparent"}
                placeholder={placeholder}
                type={inputType}
                {...othersSettings}
                {...register(name, {
                  required: isRequired,
                  valueAsNumber: type === "number",
                  disabled,
                  minLength: min
                    ? {
                        value: min,
                        message: `La lunghezza minima è di ${min} caratteri`,
                      }
                    : undefined,
                  maxLength: max
                    ? {
                        value: max,
                        message: `La lunghezza massima è di ${max} caratteri`,
                      }
                    : undefined,
                })}
                borderRadius={"lg"}
                _hover={{
                  borderColor: hoverInputColor,
                }}
                _focusVisible={{
                  borderColor: hoverInputColor,
                }}
                size={"lg"}
                fontFamily={"Inter-Regular"}
                border={"1px solid"}
                borderColor={"#e4e4e4"}
                _focus={{
                  borderColor: "var(--black-primary)",
                  boxShadow: "0 0 0 1px var(--black-primary)",
                }}
              />
              {type === "password" && (
                <InputRightElement
                  cursor={"pointer"}
                  color={mainInnerColor}
                  onClick={passwordClick}
                >
                  {inputType === "password" ? <FiEye /> : <FiEyeOff />}
                </InputRightElement>
              )}
            </InputGroup>
          )}
        </>
      )}
      <FormErrorMessage>
        <>{error?.message}</>
      </FormErrorMessage>
      {max && (
        <FormHelperText
          color={
            value && (value as string).length > max ? "red.500" : undefined
          }
        >{`${
          (value && (value as string).length) || 0
        }/${max} caratteri`}</FormHelperText>
      )}
    </FormControl>
  );
};

export default PrimaryInput;
