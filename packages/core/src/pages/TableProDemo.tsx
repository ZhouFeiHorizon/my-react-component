import TablePro, { getColumns } from "../components/TablePro/tablePro";
import Icon, { IconDelete } from "@douyinfe/semi-icons";

const TableProDemo = () => {
  // const columns = getColumns(
  //   [
  //     {
  //       title: "序号",
  //       dataIndex: "index",
  //       key: "index",
  //       type: "index",
  //     },
  //     {
  //       title: "视频信息",
  //       dataIndex: "videoInfo",
  //       key: "videoInfo",
  //       type: "videoInfo",
  //     },
  //     {
  //       title: "创作者信息",
  //       dataIndex: "anchorInfo",
  //       key: "anchorInfo",
  //       type: "anchorInfo",
  //     },
  //     {
  //       title: "姓名",
  //       dataIndex: "name",
  //       key: "name",
  //     },
  //     {
  //       title: "头像",
  //       dataIndex: "avatar",
  //       key: "avatar",
  //       type: "avatar",
  //     },
  //     {
  //       title: "时间",
  //       dataIndex: "time",
  //       key: "time",
  //     },
  //     {
  //       title: "年龄",
  //       dataIndex: "age",
  //       key: "age",
  //     },
  //     {
  //       title: "金额",
  //       dataIndex: "amount",
  //       key: "amount",
  //       type: "number",
  //       renderProps: {
  //         suffix: "元",
  //         transform: ["divide", 1000],
  //         type: "currency",
  //         roundingMode: "trunc",
  //         numberUnit: "auto",
  //       },
  //     },
  //     {
  //       title: "acu",
  //       dataIndex: "acu",
  //       key: "acu",
  //       type: "number",
  //     },
  //     {
  //       title: "进度",
  //       dataIndex: "progress",
  //       key: "progress",
  //       type: "number",
  //       renderProps: {
  //         maximumFractionDigits: 1,
  //       },
  //     },

  //     {
  //       title: "开始时间",
  //       dataIndex: "taskStartTime",
  //       key: "taskStartTime",
  //       type: "date",
  //       renderProps: {
  //         format: "YYYY-MM-DD HH:mm:ss",
  //       },
  //     },
  //     {
  //       title: "任务时间",
  //       dataIndex: "taskTime",
  //       key: "taskTime",
  //       type: "dateRange",
  //       dataProp: {
  //         startTime: "taskStartTime",
  //         endTime: "taskEndTime",
  //       },
  //       renderProps: {
  //         layout: "vertical",
  //         separate: "至",
  //       },
  //     },
  //     // {
  //     //   title: "操作",
  //     //   dataIndex: "operation",
  //     //   key: "operation",
  //     //   type: "action",
  //     //   renderProps: {
  //     //     maxShowCount: 2,
  //     //   },
  //     //   actions: (val, record, index) => [
  //     //     {
  //     //       label: "查看详情",
  //     //       disabled: false,
  //     //       onClick: () => {},
  //     //     },
  //     //     {
  //     //       label: "编辑",
  //     //       icon: "edit",
  //     //       disabled: false,
  //     //       onClick: () => {},
  //     //     },
  //     //     {
  //     //       label: "删除",
  //     //       type: "danger",
  //     //       icon: <IconDelete />,
  //     //       onClick: () => {
  //     //         console.log("删除");
  //     //       },
  //     //     },
  //     //     {
  //     //       label: "复制",
  //     //       icon: "copy",
  //     //       onClick: () => {
  //     //         console.log("复制");
  //     //       },
  //     //     },
  //     //   ],
  //     // },
  //   ],
  //   {}
  // );

  const dataSource = [
    {
      avatar:
        "https://p3-webcast-game-sign.byteimg.com/tos-cn-i-23auat310x/4a613f1ce56ac49c1ccea9ba86029475~tplv-23auat310x-image.image?rk3s=f02852c0&x-expires=4875310140&x-signature=%2B1U%2FzbAS2uLdoPEdIpfoTTN4L28%3D",
      time: 123,
      name: "张三",
      age: 18,
      taskStartTime: "2023-01-01 00:00:00",
      taskEndTime: "2025-01-01 00:00:00",
      amount: 119208089,
      acu: 123412,
      progress: 0.15,
      videoInfo: {
        title: "视频标题",
        cover:
          "https://p3-webcast-game-sign.byteimg.com/tos-cn-i-23auat310x/4a613f1ce56ac49c1ccea9ba86029475~tplv-23auat310x-image.image?rk3s=f02852c0&x-expires=4875310140&x-signature=%2B1U%2FzbAS2uLdoPEdIpfoTTN4L28%3D",
      },
      index: 1,
    },
    {
      name: "张三",
      age: 18,
      taskStartTime: "",
      taskEndTime: "",
      amount: 12310,
      acu: 99012341231324,
      progress: 0.13579,
      index: 2,
    },
    {
      name: "张三",
      age: 18,
      taskStartTime: "",
      taskEndTime: "",
      amount: 123,
      acu: 223,
      progress: 0.123,
      index: 3,
    },
  ] as any[];

  return (
    <TablePro
      dataSource={dataSource}
      customColumnMap={{
        // avatar: {
        //   customRender: ({ avatar }) => {
        //     return (
        //       <div>
        //         <img src={avatar} alt={avatar} width={32} height={32} />
        //       </div>
        //     );
        //   },
        // },
        videoInfo: {
          customRender: ({ title, cover }: { title: string; cover: string }) => {
            return (
              <div>
                <div>{title}</div>
                <div>
                  <img src={cover} alt={title} width={32} height={32} />
                </div>
              </div>
            );
          },
        },
      }}
      columns={[
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          type: "index",
        },
        {
          // title: "视频信息",
          dataIndex: "videoInfo",
          key: "videoInfo",
          type: "videoInfo",
          dataProp: {
            title: "videoInfo.title",
            cover: "videoInfo.cover",
          },
          renderProps: {

          }
        },
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "头像",
          dataIndex: "avatar",
          key: "avatar",
          type: "avatar",
          dataProp: {
            avatar: "avatar",
          },
        },
        {
          title: "时间",
          dataIndex: "time",
          key: "time",
        },
        {
          title: "年龄",
          dataIndex: "age",
          key: "age",
        },
        {
          title: "金额",
          dataIndex: "amount",
          key: "amount",
          type: "number",
          renderProps: {
            type: 'currency',
            suffix: "元",
            transform: ["divide", 1000],
            type: "currency",
            roundingMode: "trunc",
            numberUnit: "auto",
          },
        },
        {
          title: "acu",
          dataIndex: "acu",
          key: "acu",
          type: "number",
        },
        {
          title: "进度",
          dataIndex: "progress",
          key: "progress",
          type: "number",
          renderProps: {
            maximumFractionDigits: 1,
          },
        },

        {
          title: "开始时间",
          dataIndex: "taskStartTime",
          key: "taskStartTime",
          type: "date",
          renderProps: {
            format: "YYYY-MM-DD HH:mm:ss",
          },
        },
        {
          title: "任务时间",
          dataIndex: "taskTime",
          key: "taskTime",
          type: "dateRange",
          dataProp: {
            startTime: "taskStartTime",
            endTime: "taskEndTime",
          },
          renderProps: {
            layout: "vertical",
            separate: "至",
          },
        },
        // {
        //   title: "操作",
        //   dataIndex: "operation",
        //   key: "operation",
        //   type: "action",
        //   renderProps: {
        //     maxShowCount: 2,
        //   },
        //   actions: (val, record, index) => [
        //     {
        //       label: "查看详情",
        //       disabled: false,
        //       onClick: () => {},
        //     },
        //     {
        //       label: "编辑",
        //       icon: "edit",
        //       disabled: false,
        //       onClick: () => {},
        //     },
        //     {
        //       label: "删除",
        //       type: "danger",
        //       icon: <IconDelete />,
        //       onClick: () => {
        //         console.log("删除");
        //       },
        //     },
        //     {
        //       label: "复制",
        //       icon: "copy",
        //       onClick: () => {
        //         console.log("复制");
        //       },
        //     },
        //   ],
        // },
      ]}
    />
  );
};

export default TableProDemo;
