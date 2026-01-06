import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SignInFormData {
  username: string;
  password: string;
}

interface ProfileFormData {
  name: string;
  username: string;
  password: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface TouchedFields {
  [key: string]: boolean;
}

interface FormState {
  signIn: {
    formData: SignInFormData;
    loading: boolean;
    validationErrors: ValidationErrors;
    touched: TouchedFields;
  };
  profile: {
    formData: ProfileFormData;
    user: any | null;
    loading: boolean;
    error: string;
  };
}

const initialState: FormState = {
  signIn: {
    formData: {
      username: '',
      password: '',
    },
    loading: false,
    validationErrors: {
      username: '',
      password: '',
    },
    touched: {
      username: false,
      password: false,
    },
  },
  profile: {
    formData: {
      name: '',
      username: '',
      password: '',
    },
    user: null,
    loading: false,
    error: '',
  },
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormField: (
      state,
      action: PayloadAction<{ form: 'signIn' | 'profile'; field: string; value: any }>
    ) => {
      const { form, field, value } = action.payload;
      state[form].formData = { ...state[form].formData, [field]: value };
    },
    setFormLoading: (state, action: PayloadAction<{ form: 'signIn' | 'profile'; loading: boolean }>) => {
      const { form, loading } = action.payload;
      state[form].loading = loading;
    },
    setValidationErrors: (
      state,
      action: PayloadAction<{ form: 'signIn' | 'profile'; errors: ValidationErrors }>
    ) => {
      const { form, errors } = action.payload;
      state[form].validationErrors = errors;
    },
    setValidationError: (
      state,
      action: PayloadAction<{ form: 'signIn' | 'profile'; field: string; error: string }>
    ) => {
      const { form, field, error } = action.payload;
      state[form].validationErrors = { ...state[form].validationErrors, [field]: error };
    },
    setTouched: (
      state,
      action: PayloadAction<{ form: 'signIn' | 'profile'; touched: TouchedFields }>
    ) => {
      const { form, touched } = action.payload;
      state[form].touched = touched;
    },
    setTouchedField: (
      state,
      action: PayloadAction<{ form: 'signIn' | 'profile'; field: string; touched: boolean }>
    ) => {
      const { form, field, touched } = action.payload;
      state[form].touched = { ...state[form].touched, [field]: touched };
    },
    resetForm: (state, action: PayloadAction<'signIn' | 'profile'>) => {
      const form = action.payload;
      if (form === 'signIn') {
        state.signIn = initialState.signIn;
      } else {
        state.profile = initialState.profile;
      }
    },
    setProfileUser: (state, action: PayloadAction<any>) => {
      state.profile.user = action.payload;
      if (action.payload) {
        state.profile.formData = {
          name: action.payload.name || '',
          username: action.payload.username || '',
          password: '',
        };
      }
    },
    setProfileError: (state, action: PayloadAction<string>) => {
      state.profile.error = action.payload;
    },
    clearProfileError: (state) => {
      state.profile.error = '';
    },
  },
});

export const {
  updateFormField,
  setFormLoading,
  setValidationErrors,
  setValidationError,
  setTouched,
  setTouchedField,
  resetForm,
  setProfileUser,
  setProfileError,
  clearProfileError,
} = formSlice.actions;
export default formSlice.reducer;

