
export const typeList = [{
  'value': 0,
  'label': '否'
},
{
  'value': 1,
  'label': '是'
}]

// 表格
export const tableOption = [
  {
    label: '编号',
    prop: 'id',
    hide: true
  },
  {
    label: '导航名称',
    prop: 'name',
    overHidden: true,
    width: '120'
  },
  {
    label: '链接地址',
    prop: 'url',
    hide: true
  },
  {
    label: '类型',
    prop: 'code',
    dicUrl: 'navigation_type',
    overHidden: true
  },
  {
    label: '图片',
    prop: 'pic',
    hide: true
  },
  {
    label: '是否启用',
    prop: 'openFlag',
    overHidden: true,
    slot: true
  },
  {
    label: '是否打开新窗口',
    prop: 'newwinFlag',
    width: '180',
    slot: true
  },
  {
    label: '显示顺序',
    prop: 'sequence',
    width: '100'
  },
  {
    label: '创建时间',
    prop: 'createTime'
  },
  {
    width: 180,
    label: '修改时间',
    prop: 'updateTime'
  }
]
// 表单校验
export const rules = {
  name: [
    { required: true, message: '导航名称不能为空', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请选择类型', trigger: 'change' }
  ],
  openFlag: [
    { required: true, message: '请选择是否启用', trigger: 'change' }
  ],
  newwinFlag: [
    { required: true, message: '请选择是否打开新窗口', trigger: 'change' }
  ],
  img: [
    { required: true, message: '请上传图片' }
  ]
}
