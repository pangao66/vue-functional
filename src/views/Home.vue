<template>
  <div class="home">
    <t-table
        :data="tableData"
        :columns="columns"
    >
      <template slot="city-slot" slot-scope="{scope}">
        <template v-for="item in classifyCity(scope.row.cities)">
          <div style="text-align: left;padding: 0 5px;">
            <span class="province-span" style=" margin-right: 20px;"> {{item.provinceName}}:</span>
            <el-tag v-for="cityItem in item.city" size="mini" style="margin-right: 5px;margin-bottom: 5px;"
                    :key="cityItem.secondCode">{{cityItem.secondName}}
            </el-tag>
          </div>
        </template>
        <span v-if="!scope.row.cities.length">-</span>
      </template>
      <template slot="status" slot-scope="{scope}">
        {{scope.row.companyEnable? '启用' : '禁用'}}
      </template>
      <template slot="handle" slot-scope="{scope}">
        <el-button :type="scope.row.companyEnable?'primary?':'warning'"
                   @click.stop="changeStatus(scope.row)">
          {{scope.row.companyEnable? '禁用' : '启用'}}
        </el-button>
      </template>
    </t-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {createComponent, onCreated, value, plugin} from 'vue-function-api'
import TTable from '@/components/t-table.vue'; // @ is an alias to /src
import {getInsuranceTableData, editInsurerStatus} from '@/server/demo'
import {Message} from 'element-ui'

Vue.use(plugin)
const columns = [
  {
    label: '序号',
    prop: 'id'
  },
  {
    label: '保司简称',
    prop: 'name'
  },
  {
    label: '保司编号',
    prop: 'code'
  },
  {
    label: '保司名称',
    prop: 'unionName'
  },
  {
    label: '可投保城市',
    slot: 'city-slot',
    attrs: {width: 600, 'class-name': 'insurer__cell_wrapper'}
  },
  {
    label: '状态',
    slot: 'status'
  },
  {
    label: '操作',
    slot: 'handle'
  }
]
const tableData = value([]);
export default createComponent({
  setup() {
    onCreated(() => {
      getInsuranceTableData({}).then((res: any) => {
        tableData.value = res.data
      })
    });
    const handleTestEmit = (): void => {
      console.log('recevied from child component')
    };
    const changeStatus = async (row: any) => {
      const res = await editInsurerStatus({
        id: row.id,
        companyEnable: !row.companyEnable
      })
      if (res.returnCode === 10000) {
        this.$message({message: '操作成功', type: 'success'})
        this.getAllInsurer()
        this.refreshList()
      }
    }
    const classifyCity = (city: any[]) => {
      let obj: any = {}
      city.forEach((item) => {
        if (!obj[item.provinceCode]) {
          obj[item.provinceCode] = {
            provinceCode: item.provinceCode,
            provinceName: item.provinceName,
            city: [{
              ...item
            }]
          }
        } else {
          obj[item.provinceCode].city.push({
            ...item
          })
        }
      })
      let list = []
      for (let i in obj) {
        list.push(obj[i])
      }
      return list
    }
    return {
      handleTestEmit,
      tableData,
      columns: columns,
      classifyCity
    }
  },
  components: {
    TTable
  }
})
</script>
