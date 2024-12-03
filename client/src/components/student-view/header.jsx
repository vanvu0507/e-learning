
import { GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { fetchCourseSearch, fetchCourseSearchSuggestions } from "@/services";
import { StudentContext } from "@/context/student-context";

function StudentViewCommonHeader() {

    const navigate = useNavigate();

    const { resetCredentials } = useContext(AuthContext)

    const {searchQuery, setSearchQuery} = useContext(StudentContext);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearchChange = async (event) => {
      const query = event.target.value;
      setSearchQuery(query);
      if (query.length >= 3) { // Chỉ tìm kiếm khi người dùng nhập ít nhất 1 ký tự
        const response = await fetchCourseSearchSuggestions(query);
        if (response.success) {
          // console.log(response.data)
          setSearchResults(response.data); // Lưu kết quả tìm kiếm vào state
        }
      } else {
        setSearchResults([]); // Xóa kết quả tìm kiếm nếu chuỗi tìm kiếm ngắn hơn 1 ký tự
      }
    };

    const handleSearchEnter = async (event) => {
      if (event.key === 'Enter' && searchQuery.trim().length > 0) {
        // Fetch suggestions để lấy thông tin tìm kiếm
        const response = await fetchCourseSearch(searchQuery);
        console.log(response.data[0].title);
        if (response.success && response.data.length > 0) {
          const firstResult = response.data[0]; // Lấy kết quả đầu tiên (hoặc tùy chọn logic khác)
          navigate('/courses', {
            state: {
              searchQuery: searchQuery // lấy searchQuery để đảm bảo độ chính xác
            }
          });
    
          // Xóa kết quả gợi ý và làm trống thanh tìm kiếm
          // setSearchQuery('');
          setSearchResults([]);
        }
      }
    };    

    const handleSelectSuggestion = (courseId) => {
      // Redirect đến trang chi tiết khóa học
      window.location.href = `/course/details/${courseId}`;

      // Reset search query và search results
      setSearchQuery('');
      setSearchResults([]);

    };

    function handleLogout() {
        resetCredentials();
        sessionStorage.clear();
    }

    return (
        <header className="flex items-center justify-between p-4 border-b relative">
            <div className="flex items-center space-x-4">
                <Link to="/home" className="flex items-center hover:text-black">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold md:text-xl text-[14px]">ONLINE LEARNING</span>
                </Link>
                <div className="flex items-center space-x-1">
                <Button
                    variant="ghost"
                    onClick={() => {
                        location.pathname.includes('/courses') ? null :
                        navigate('/courses')
                    }}
                    className="text-[14px] md:text-[16px] font-medium">
                    Explore Courses
                </Button>
            </div>
            </div>

            <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleSearchEnter}
          className="px-4 py-2 border rounded-lg"
          placeholder="Searching something !"
        />
        {searchQuery.length > 0 && searchResults.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border mt-1 max-h-60 overflow-y-auto shadow-lg">
            {searchResults.map((course) => (
              <li
                key={course._id}
                onClick={() => handleSelectSuggestion(course._id)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                {course.title}
              </li>
            ))}
          </ul>
        )}
      </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex gap-4 items-center">
                    <div onClick={() => navigate('/student-courses')} className="flex cursor-pointer items-center gap-3">
                        <span className="font-extrabold md:text-xl text-[14px]">
                            My Courses
                        </span>
                        <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
                    </div>
                    <Button onClick={handleLogout}>Sign Out</Button>
                </div>
            </div>
        </header>
    )
}

export default StudentViewCommonHeader;
