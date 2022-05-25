import React, { useState } from 'react';
import { Image, Col, Row, Tabs, Modal, Button } from 'antd';
import { QuestionOutlined, UserOutlined } from '@ant-design/icons';

import { Header } from './../../components/Header';

type Props = {
  email: string | null;
  picture: string | null;
};

const { TabPane } = Tabs;

const HomePage = ({ email, picture }: Props) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };
  return (
    <div className="home-page">
      <Header email={email} picture={picture} />
      <Row>
        <Col span={8}>
          <h1 style={{ fontSize: 40 }}>RETROSPECTIVE IS GOOD</h1>
          <p style={{ color: 'gray', letterSpacing: 1 }}>
            Retrospective là một phương pháp áp dụng trong giáo dục từ rất lâu. Phương pháp này giúp cho mọi người có
            thể nhìn nhận lại quá trình làm việc cũng như có thể biết được phần làm tốt và chưa tốt, từ đó chúng ta có
            thể cho ra được kết quả của bản thân cũng như tất cả thành viên trong nhóm sau quá trình làm việc. Để tìm
            hiểu kĩ hơn về nó , mời các bạn xuống dưới chúng ta cùng tìm hiểu rõ hơn.
          </p>
        </Col>
        <Col span={10}>
          <Image
            preview={false}
            src="/images/teamwork-gif1.gif"
            height={330}
            style={{ marginLeft: 80, objectFit: 'cover' }}
          />
        </Col>
      </Row>
      <div className="height-30" />
      <Row>
        <Col style={{ marginLeft: 80, textAlign: 'center' }} span={24}>
          <h1 style={{ fontSize: 40 }}>wREFLECT LÀ GÌ ?</h1>
          <p style={{ color: 'gray', letterSpacing: 1 }}>
            Reflect là một phương pháp được áp dụng trong giáo dục từ rất lâu đời. Bằng cách nhìn nhận lại quá trình để
            chiêm nghiệm và học hỏi . Vì trong ngành IT chúng mình thường hay được tiếp xúc với phương pháp này và nhận
            ra nó là một phương pháp hay nên chúng mình mong qua website này chúng mình có thể giới thiệu phương pháp
            đến với mọi người để mọi người có thể sử dụng nó và nhận được những lợi ích tích cực từ nó để không ngừng
            cống hiến cho xã hội .
          </p>
        </Col>
      </Row>
      <div className="height-30" />
      <Row>
        <Col span={10}>
          <Image preview={false} src="/images/teamwork-gif2.gif" height={390} style={{ objectFit: 'cover' }} />
        </Col>
        <Col style={{ marginLeft: 80 }} span={8}>
          <h1 style={{ fontSize: 40 }}>Tại sao lại wReflect ?</h1>
          <p style={{ color: 'gray', letterSpacing: 1 }}>
            Để phát triển bản thân thì mình tin rằng điều khó nhất là nhìn nhận lại chính bản thân mình và thành thật
            với nó trong suốt quãng đường . Chính vì điều đó mà khi có thể nhìn nhận lại bản thân bằng cách soi mình
            trong gương thì chúng ta mới có thể nhìn rõ điểm mạnh và điểm yếu của bản thân . Qua việc nhìn nhận lại giá
            trị bản thân thì người sử dụng sẽ có thể khắc phục điểm yếu của bản thân và thêm tự tin hơn với thế mạnh của
            mình .Nhìn nhận điểm yếu của bản thân để hoàn thiện nó là việc quan trong nhưng nhìn nhận ra thế mạnh của
            bản thân cũng quan trọng không kém .
          </p>
        </Col>
      </Row>
      <div className="height-30" />
      <Row>
        <Col style={{ marginLeft: 80 }} span={24}>
          <h1 style={{ fontSize: 40, textAlign: 'center' }}>GIÁ TRỊ CỦA wREFLECT ĐEM LẠI CHO NHÓM ? </h1>
          <div style={{ color: 'gray', letterSpacing: 1 }}>
            <p>
              - Với Member : giúp cho người dùng có thể tạo được một team như ý muốn và giúp Leader dễ dàng quản lí các
              thành viên của mình .{' '}
            </p>
            <p>
              - Với Reflection Board : đây là công cụ hữu ích cho team để có thể họp online . Nơi mọi người có thể đưa
              ra ý kiến và cùng nhau nhìn nhận lại các điểm tốt cũng như xấu mà team đã làm được trong thời gian làm
              việc để đưa ra các phương án để thể cải thiện tình hình cũng như là giữ vững phong độ của team .{' '}
            </p>
            <p>
              - Với Action tracker : đây là nơi giúp team tracking công việc của team đã đề ra cũng như nhìn nhận lại
              xem những công việc đó đã được hoàn thành hay chưa . Và có thể biết rõ là ai đã hoàn thành và ai còn chưa
              hoàn thành và cần nhắc nhở hay khen ngợi . Ngoài ra việc tracking sẽ giúp các thành viên trong team luôn
              biết mình cần phải làm gì với mỗi kế hoạch đề ra sau mỗi cuộc họp.
            </p>
            <p>
              - Với Health Check : Nơi giúp team tracking sức khỏe tinh thần của nhóm để không ai bị lùi lại phía sau .
              Bằng việc nhìn nhận lại tinh thần làm việc của cả team sẽ giúp team nhìn thấy được những nguy cơ tiềm ẩn
              bên trong để sớm đưa ra được những giải pháp phù hợp vì chúng ta cũng hiểu không ai có thể làm việc tốt
              được với một tinh thần không khỏe mạnh cả .
            </p>
            <p>
              - Với Personal Reflection : Nơi giúp team có thể góp ý với đồng đội cũng nhưng đánh giá lại chính bản thân
              mình để mình và đồng đội có thể nhìn thấy thiếu xót để hoàn thiện hoặc đôi khi cũng có thể lời khen ngợi
              để tiếp tục phát huy và cố gắng cống hiến .{' '}
            </p>
          </div>
        </Col>
      </Row>
      <div className="height-30" />
      <Row>
        <Col style={{ marginLeft: 80 }} span={24}>
          <h1 style={{ fontSize: 40, textAlign: 'center' }}>GIÁ TRỊ CỦA wREFLECT ĐEM LẠI CHO NGƯỜI DÙNG ? </h1>
          <div style={{ color: 'gray', letterSpacing: 1 }}>
            <p>
              - Với Reflection Board : Đây là nơi mọi người được lắng nghe và thoải mái đưa ra ý kiến cá nhân giúp team
              phát triển hơn.
            </p>
            <p>
              - Với Health Check : Người dùng phải trả lời các câu hỏi qua đó họ sẽ nhận ra bản thân có đang thực sự
              hiểu dự án trong giai đoạn hiện tại hay có sự chểnh mảng trong công việc hay không để có thể chấn chỉnh
              bản thân kịp thời ngoài ra thì đây cũng có thể biểu lộ cảm xúc của họ để mọi thành viên trong team có thể
              lắng nghe.
            </p>
            <p>
              - Với Actions Tracker : Nơi giúp mọi người luôn có thể tracking được status công việc của mình cũng như là
              của các thành viên còn lại giúp mọi người dễ dàng quản lí công việc cá nhân hơn.
            </p>
            <p>
              - Với Personal Reflection : đây là nơi mọi người có thể góp ý về các thành viên trong nhóm cũng như tự
              nhìn nhận lại bản thân để có cái nhìn tổng quan nhất về tình hình hiện tại của bản thân . Có giá trị rất
              lớn trong việc hoàn thiện bản thân hơn từng ngày.
            </p>
            <p>
              - Với Personal Profile : Qua việc tự đánh giá bản thân và được đánh giá bởi các thành viên đã từng làm
              việc cùng thì đây là nơi sẽ lưu lại những dữ liệu đó . Đây là nơi thể hiện những điểm mạnh và điểm yếu của
              bạn qua các lần thực hiện làm việc nhóm . Skill chart này sẽ như một sự công nhận cho sự nỗ lực thay đổi
              cố gắng hơn từng ngày của người dùng và nó sẽ là bằng chứng được đánh giá bằng số liệu có sự tin tưởng cao
              giúp người dùng có thể chứng minh với các nhà tuyển dụng hoặc thuyết phục leader nào đó về việc tuyển họ
              vào team . Chính vì đây là sự phản ánh về khả năng làm việc nhóm của bản thân người dùng nên họ sẽ phải cố
              gắng nỗ lực không ngừng nghỉ để luôn có được phong độ tốt nhất thể hiện qua skill chart .
            </p>
            <p>
              - Searching Profile : Chức năng này sẽ giúp người dùng tìm được những người có yêu cầu phù hợp với vị trí
              họ đang cần . Bằng việc tìm kiếm qua dữ liệu của skill chart sẽ giúp người dùng tìm được các mảnh ghép phù
              hợp để tạo thành một team và bắt đầu dự án của họ . Điều này giúp kết nối những mảnh ghép hoàn hảo đến với
              nhau và giúp họ làm việc team tốt hơn .
            </p>
          </div>
        </Col>
      </Row>
      <div className="height-30" />
      <Row>
        <Col span={11}>
          <h1 style={{ fontSize: 40 }}>TÓM LẠI</h1>
          <p style={{ color: 'gray', letterSpacing: 1 }}>
            Chính vì những lí do trên và dựa vào phương pháp Reflect team mình đã viết ra ứng dụng wReflect với mong
            muốn đây sẽ là một công cụ giúp các team cũng như cá nhân có thể nhìn nhận lại quá trình làm việc để có thể
            sớm khắc phục điểm yếu cũng như duy trì phong độ trong suốt dự án . Không chỉ là công cụ để đo lường họp
            hành mà chúng mình mong có thể là nơi để mọi người thoải mái phát biểu ý kiến cũng như được lắng nghe . Đồng
            thời giúp những người dùng đang băn khoăn về bản thân có thể hiểu rõ mình và tìm được những người đồng hành
            phù hợp với bản thân . Mong rằng chúng mình sẽ luôn được đồng hành cùng các bạn trong suốt chặng đường phát
            triển sắp tới .
          </p>
          <div className="button-home-page">
            <a href="https://dev-m0ubghav.us.auth0.com/u/signup?state=hKFo2SA1MGI3VTFwWGs0Q2h3MjhUNWZjcXhPVjB1eFhZRzR3eaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEwxRUNyNGd5eFNCUVRaeUtScnFpS0k0UTJnTjVnalVOo2NpZNkgY09LQTFUWXN3V0YwU3R1bkpLT2p0MXY0T0JWV1R0dEE">
              <Button shape="round" type="primary" icon={<UserOutlined />} style={{ marginRight: 20 }}>
                Sign Up
              </Button>
            </a>
            <Button shape="round" type="dashed" icon={<QuestionOutlined />} onClick={handleShowModal}>
              Xem hướng dẫn
            </Button>
          </div>
        </Col>
        <Col span={10}>
          <Image
            preview={false}
            src="/images/teamwork-gif3.gif"
            height={400}
            style={{ marginLeft: 50, objectFit: 'cover' }}
          />
        </Col>

        <Modal className="modal-userguide" title="User Guide" visible={showModal} onCancel={handleCancel}>
          <Row>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Create Team" key="1">
                <iframe width="950" height="350" src="https://www.youtube.com/embed/G6C0enWSx-Q/"></iframe>{' '}
              </TabPane>
              <TabPane tab="Add member" key="2">
                <iframe width="950" height="350" src="https://www.youtube.com/embed/eSSS5c9K4yw"></iframe>{' '}
              </TabPane>
              <TabPane tab="Do Reflect" key="3">
                <iframe width="950" height="350" src="https://www.youtube.com/embed/QDSBj48JwRw/"></iframe>{' '}
              </TabPane>
            </Tabs>
          </Row>
        </Modal>
      </Row>
    </div>
  );
};

export default HomePage;
