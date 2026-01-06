import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalFormData {
  [key: string]: any;
}

interface BaseModalState {
  isOpen: boolean;
  formData: ModalFormData;
  isSaving: boolean;
}

interface CreateAssetTrackingModalState extends BaseModalState {
  users: any[];
  assets: any[];
  showAssignedDatePicker: boolean;
  showRemovedDatePicker: boolean;
}

interface DetailModalState extends BaseModalState {
  item: any | null;
  isEditing: boolean;
}

interface AssetTreeModalState {
  isOpen: boolean;
  selectedUser: any | null;
}

interface ModalState {
  createUser: BaseModalState;
  createAsset: BaseModalState;
  createAssetTracking: CreateAssetTrackingModalState;
  assetDetail: DetailModalState;
  userDetail: DetailModalState;
  assetTrackingDetail: DetailModalState;
  assetTree: AssetTreeModalState;
}

const getInitialFormData = (modalType: string): ModalFormData => {
  switch (modalType) {
    case 'createUser':
      return {
        user_number: '',
        name: '',
        username: '',
        password: '',
        address: '',
        work_location: 'remote',
        role: 'user',
        social_insurance: false,
        medical_insurance: false,
        join_date: new Date().toISOString().split('T')[0],
        contract_date: '',
      };
    case 'createAsset':
      return {
        label: '',
        type: '',
        asset_type: '',
        model: '',
        serial_number: '',
        status: 'Active',
        ram: '',
        laptop_processor: '',
        laptop_ssd: '',
        laptop_hdd: '',
        laptop_graphics_card: '',
        laptop_monitor: '',
        mobile_imei_1: '',
        mobile_imei_2: '',
        mobile_internal_memory: '',
        mobile_external_memory: '',
        phone_number: '',
        phone_company: '',
        phone_current_plan: '',
        phone_legal_owner: '',
        phone_comment: '',
        details: '',
      };
    case 'createAssetTracking':
      return {
        user_id: '',
        asset_id: '',
        assigned_at: '',
        removed_at: '',
      };
    default:
      return {};
  }
};

const initialState: ModalState = {
  createUser: {
    isOpen: false,
    formData: getInitialFormData('createUser'),
    isSaving: false,
  },
  createAsset: {
    isOpen: false,
    formData: getInitialFormData('createAsset'),
    isSaving: false,
  },
  createAssetTracking: {
    isOpen: false,
    formData: getInitialFormData('createAssetTracking'),
    isSaving: false,
    users: [],
    assets: [],
    showAssignedDatePicker: false,
    showRemovedDatePicker: false,
  },
  assetDetail: {
    isOpen: false,
    formData: {},
    isSaving: false,
    item: null,
    isEditing: false,
  },
  userDetail: {
    isOpen: false,
    formData: {},
    isSaving: false,
    item: null,
    isEditing: false,
  },
  assetTrackingDetail: {
    isOpen: false,
    formData: {},
    isSaving: false,
    item: null,
    isEditing: false,
  },
  assetTree: {
    isOpen: false,
    selectedUser: null,
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ modal: keyof ModalState; data?: any }>) => {
      const { modal, data } = action.payload;
      if (modal === 'assetTree') {
        state.assetTree.isOpen = true;
        state.assetTree.selectedUser = data || null;
      } else if (modal === 'assetDetail' || modal === 'userDetail' || modal === 'assetTrackingDetail') {
        const detailModal = state[modal] as DetailModalState;
        detailModal.isOpen = true;
        detailModal.item = data || null;
        detailModal.formData = data || {};
        detailModal.isEditing = false;
      } else {
        const baseModal = state[modal] as BaseModalState;
        baseModal.isOpen = true;
        if (data) {
          baseModal.formData = { ...getInitialFormData(modal), ...data };
        } else {
          baseModal.formData = getInitialFormData(modal);
        }
      }
    },
    closeModal: (state, action: PayloadAction<keyof ModalState>) => {
      const modal = action.payload;
      if (modal === 'assetTree') {
        state.assetTree.isOpen = false;
        state.assetTree.selectedUser = null;
      } else if (modal === 'assetDetail' || modal === 'userDetail' || modal === 'assetTrackingDetail') {
        const detailModal = state[modal] as DetailModalState;
        detailModal.isOpen = false;
        detailModal.item = null;
        detailModal.formData = {};
        detailModal.isEditing = false;
      } else {
        const baseModal = state[modal] as BaseModalState;
        baseModal.isOpen = false;
        baseModal.formData = getInitialFormData(modal);
      }
    },
    updateModalFormData: (
      state,
      action: PayloadAction<{ modal: keyof ModalState; field: string; value: any }>
    ) => {
      const { modal, field, value } = action.payload;
      if (modal === 'assetTree') return;
      
      if (modal === 'assetDetail' || modal === 'userDetail' || modal === 'assetTrackingDetail') {
        const detailModal = state[modal] as DetailModalState;
        detailModal.formData = { ...detailModal.formData, [field]: value };
      } else {
        const baseModal = state[modal] as BaseModalState;
        baseModal.formData = { ...baseModal.formData, [field]: value };
      }
    },
    setModalFormData: (
      state,
      action: PayloadAction<{ modal: keyof ModalState; formData: ModalFormData }>
    ) => {
      const { modal, formData } = action.payload;
      if (modal === 'assetTree') return;
      
      if (modal === 'assetDetail' || modal === 'userDetail' || modal === 'assetTrackingDetail') {
        const detailModal = state[modal] as DetailModalState;
        detailModal.formData = formData;
      } else {
        const baseModal = state[modal] as BaseModalState;
        baseModal.formData = formData;
      }
    },
    setModalSaving: (state, action: PayloadAction<{ modal: keyof ModalState; isSaving: boolean }>) => {
      const { modal, isSaving } = action.payload;
      if (modal === 'assetTree') return;
      
      if (modal === 'assetDetail' || modal === 'userDetail' || modal === 'assetTrackingDetail') {
        const detailModal = state[modal] as DetailModalState;
        detailModal.isSaving = isSaving;
      } else {
        const baseModal = state[modal] as BaseModalState;
        baseModal.isSaving = isSaving;
      }
    },
    setModalEditing: (
      state,
      action: PayloadAction<{ modal: 'assetDetail' | 'userDetail' | 'assetTrackingDetail'; isEditing: boolean }>
    ) => {
      const { modal, isEditing } = action.payload;
      const detailModal = state[modal] as DetailModalState;
      detailModal.isEditing = isEditing;
    },
    setCreateAssetTrackingData: (
      state,
      action: PayloadAction<{ users?: any[]; assets?: any[] }>
    ) => {
      const { users, assets } = action.payload;
      if (users) state.createAssetTracking.users = users;
      if (assets) state.createAssetTracking.assets = assets;
    },
    setCreateAssetTrackingDatePicker: (
      state,
      action: PayloadAction<{ type: 'assigned' | 'removed'; show: boolean }>
    ) => {
      const { type, show } = action.payload;
      if (type === 'assigned') {
        state.createAssetTracking.showAssignedDatePicker = show;
      } else {
        state.createAssetTracking.showRemovedDatePicker = show;
      }
    },
    resetModal: (state, action: PayloadAction<keyof ModalState>) => {
      const modal = action.payload;
      if (modal === 'assetTree') {
        state.assetTree = { isOpen: false, selectedUser: null };
      } else if (modal === 'assetDetail' || modal === 'userDetail' || modal === 'assetTrackingDetail') {
        const detailModal = state[modal] as DetailModalState;
        detailModal.isOpen = false;
        detailModal.item = null;
        detailModal.formData = {};
        detailModal.isEditing = false;
        detailModal.isSaving = false;
      } else {
        const baseModal = state[modal] as BaseModalState;
        baseModal.isOpen = false;
        baseModal.formData = getInitialFormData(modal);
        baseModal.isSaving = false;
        if (modal === 'createAssetTracking') {
          state.createAssetTracking.users = [];
          state.createAssetTracking.assets = [];
          state.createAssetTracking.showAssignedDatePicker = false;
          state.createAssetTracking.showRemovedDatePicker = false;
        }
      }
    },
  },
});

export const {
  openModal,
  closeModal,
  updateModalFormData,
  setModalFormData,
  setModalSaving,
  setModalEditing,
  setCreateAssetTrackingData,
  setCreateAssetTrackingDatePicker,
  resetModal,
} = modalSlice.actions;
export default modalSlice.reducer;

