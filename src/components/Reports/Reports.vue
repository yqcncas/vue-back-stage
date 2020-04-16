<template>
    <div class="reports">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <div id="echarts" style="width: 750px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import _ from 'lodash'
    export default {
        name: "Reports",
        created () {
          this.initEchartsOptions()
        },
        mounted () {

        },
        data () {
            return {
                option :{
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {},
                    legend: {
                        data:['销量']
                    },
                    xAxis: {
                        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                    },
                    yAxis: {},
                    series: [{
                        // name: '销量',
                        // type: 'bar',
                        // data: [5, 20, 36, 10, 10, 20]
                    }]
                },
                newOption: {}
            }
        },
        methods: {
            async initEchartsOptions () {
                // 发请求获取数据
                let {data: res} = await this.$axios.get('reports/type/1')
                this.newOption = res.data
                let myChart = echarts.init(document.getElementById('echarts'));
                // 由于修改option配置 导致失去些效果 偷懒 直接合并对象 将获取的 和原有的合并
                //　使用lodash的 merge方法
                let result = _.merge(this.newOption, this.option)
                myChart.setOption(result);
            }
        }
    }
</script>

<style scoped>

</style>
