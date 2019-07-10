<template>
  <el-table
      v-bind="$attrs"
      v-on="$listeners"
      v-loading="loading"
      :data="data"
  >
    <template v-for="(col,index) in columns">
      <!-- 无列slot情况-->
      <el-table-column
          v-if="!col.slot"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          v-bind="col.attrs||{}"
          :formatter="(row,column,cellValue,index)=>formateCell(row,column,cellValue,index,col.filter)"
      >
      </el-table-column>
      <!--有列slot情况-->
      <el-table-column
          v-else
          :key="index"
          :label="col.label"
          v-bind="col.attrs||{}"
          :formatter="(row,column,cellValue,index)=>formateCell(row,column,cellValue,index,col.filter)"
      >
        <template slot-scope="scope">
          <!--自定义列 模板写法-->
          <template v-if="!col.slot.renderFn">
            <slot :name="col.slot" :scope="scope"></slot>
          </template>
          <!--自定义列 render写法-->
          <template v-else>
            {{col.slot.renderFn(scope)}}
            <!--            <VNodes :vnodes="col.slot.renderFn(scope)"></VNodes>-->
          </template>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script lang="ts">
import {formatDate} from '@/common/util';
// import {Fn} from '@/types'
type fnTypeLit = 'date' | 'point2' | 'rmb'


interface Fn {
  type: fnTypeLit;
  content?: string;
}

export default {
  name: 't-table',
  props: {
    data: {
      required: true,
      default: () => []
    },
    columns: {
      required: true,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const formateCell = (row: any, column: any, cellValue: any, index: number, fn: Fn | Function) => {
      if (fn) {
        if (typeof fn === 'object') {
          if (fn.type === 'date') {
            return formatDate(cellValue, fn.content!)
          }
          if (fn.type === 'point2') {
            return Math.floor(cellValue * 100) / 100
          }
          if (fn.type === 'rmb') {
            return (cellValue / 100).toFixed(2)
          }
        }
        if (typeof fn === 'function') {
          return fn(row, column, cellValue, index)
        }
        return cellValue
      }
      return cellValue
    }
    return {
      formateCell
    }
  },
  methods: {},
  components: {
    // VNodes: {
    //   functional: true,
    //   render: (h, ctx) => {
    //     console.log(ctx.props)
    //     return ctx.props.vnodes()
    //   }
    // }
  }
}
</script>
