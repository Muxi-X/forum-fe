import { useState, useCallback } from 'react';

type value = string | File;

const useForm = <T>(
  initValues: T,
): [T, (key: keyof T | Partial<T>, value?: value) => void] => {
  const [values, setValues] = useState(initValues);
  const setFieldValue = useCallback((key: keyof T | Partial<T>, value?: value) => {
    typeof key == 'string'
      ? setValues((preValues: T) => ({
          ...preValues,
          [key]: value,
        }))
      : setValues((pre) => ({ ...pre, ...(key as Partial<T>) }));
  }, []);

  return [values, setFieldValue];
};

export default useForm;
